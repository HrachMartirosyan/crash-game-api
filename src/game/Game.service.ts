import GameModel from '@models/mongodb/game.model';
import ConfigModel from '@models/mongodb/config.model';
import RoundModel from '@models/mongodb/round.model';
import SessionModel from '@models/mongodb/session.model';
import PlayerModel from '@models/mongodb/player.model';

import { Game } from '@interfaces/game.interface';
import { Config } from '@interfaces/config.interface';
import { Round, RoundStatus } from '@interfaces/round.interface';
import { Player } from '@interfaces/player.interface';
import { Session } from '@interfaces/session.interface';
import { Bet, BetStatus } from '@interfaces/bet.interface';
import BetModel from '@models/mongodb/bets.model';
import * as mongoose from 'mongoose';

class GameService {
  private configsModel = ConfigModel;
  private gamesModel = GameModel;
  private roundsModel = RoundModel;
  private sessionsModel = SessionModel;
  private playersModel = PlayerModel;
  private betsModel = BetModel;

  private _config: Config;
  private _game: Game;
  private _round: Round;

  private _generatedCoeffs: number[] = [];

  constructor() {}

  set config(_config: Config) {
    this._config = _config;
  }

  get config() {
    return this._config;
  }

  set game(_game: Game) {
    this._game = _game;
  }

  get game() {
    return this._game;
  }

  set round(_round: Round) {
    this._round = _round;
  }

  get round() {
    return this._round;
  }

  set generatedCoeffs(_generatedCoeffs: number[]) {
    this._generatedCoeffs = _generatedCoeffs;
  }

  get generatedCoeffs() {
    return this._generatedCoeffs;
  }

  generateCoef(max: number = 3): number {
    return Number((Math.random() * max + 1).toFixed(2));
  }

  async checkConfig(): Promise<Config> {
    const config = await this.getConfig();

    if (config) {
      return config;
    }

    return this.createConfig();
  }

  async createConfig(): Promise<Config> {
    const config = new ConfigModel({
      minBet: 10,
      maxBet: 200,
      delta: 50,
      bets: [10, 20, 50, 100, 150, 200],
    });

    return config.save();
  }

  async getConfig(): Promise<Config> {
    return this.configsModel.findOne().sort({ createdAt: -1 });
  }

  getRoundStatus(): RoundStatus {
    return this.round.status;
  }

  async createGame(): Promise<Game> {
    if (!this.config?._id) {
      throw new Error('Config is required to create a game');
    }

    const game = new GameModel({
      configID: this.config._id,
    });

    return game.save();
  }

  async fetchGame(): Promise<Game> {
    return this.gamesModel.findOne({});
  }

  async createRound(): Promise<Round> {
    const round = new RoundModel({
      gameID: this.game._id,
      coef: this.generateCoef(),
    });

    return round.save();
  }

  async fetchRound(): Promise<Round> {
    return this.roundsModel.findOne({}).sort({ createdAt: -1 });
  }

  async validateSession(sessionID?: string): Promise<boolean> {
    if (!sessionID) {
      return false;
    }

    return !!(await this.sessionsModel.findOne({ _id: sessionID }));
  }

  getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  createCoeffs(): number[] {
    const coef: number = this.round.coef;

    if (coef <= 0) {
      return [];
    }

    let result = [];
    let step = coef / this.getRandomNumber(2, 20);

    let i = 1;
    for (i; i <= coef; i += step) {
      result.push(Number(i.toFixed(2)));
    }

    if (i !== coef) {
      result.push(coef);
    }

    return result;
  }

  async closeBetting() {
    this.round.bettingClosedAt = new Date().toISOString();
    this.round.status = RoundStatus.EXECUTING;
    return this.round.save();
  }

  isBettingEnded(): boolean {
    return this.round.status !== RoundStatus.BETTING;
  }

  isBetValid(bet: BetEmit): boolean {
    return bet.amount >= this.config.minBet && bet.amount <= this.config.maxBet;
  }

  async acceptBet(bet: BetEmit, sessionID: string): Promise<Player | undefined> {
    const player = await this.getPlayerBySessionID(sessionID);

    if (!player) {
      throw new Error('Player not found');
    }

    if (player.balance < bet.amount) {
      throw new Error('Not Enough balance');
    }

    const acceptedBet = await this.betsModel.findOne({ sessionID, roundID: this.round._id });

    if (acceptedBet) {
      throw new Error('Only one bet per round');
    }

    const balanceBefore = player.balance;

    try {
      player.balance = player.balance - bet.amount;

      const betModel = new BetModel({
        createdAt: new Date(),
        sessionID: sessionID,
        gameID: this.game._id,
        playerID: player._id,
        roundID: this.round._id,
        status: BetStatus.LOST,
        coef: this.round.coef,
        amount: bet.amount,
        balance: balanceBefore,
        balanceAfter: player.balance,
      });

      await player.save();
      await betModel.save();

      return player;
    } catch (e) {
      console.error('e', e);

      player.balance = balanceBefore;
      await player.save();

      return;
    }
  }

  checkCashoutCoef(coef: number): boolean {
    return this.generatedCoeffs.includes(coef);
  }

  async doCashout(sessionID: string, coef: number): Promise<Bet | undefined> {
    if (this.round.status !== RoundStatus.EXECUTING) {
      return;
    }

    const alreadyCashedOut = await this.betsModel.findOne({
      sessionID: new mongoose.Types.ObjectId(sessionID),
      gameID: this.game._id,
      roundID: this.round._id,
      status: BetStatus.WON,
    });

    if (alreadyCashedOut) {
      return;
    }

    const updatedBet = (
      await this.betsModel.aggregate([
        {
          $match: { sessionID: new mongoose.Types.ObjectId(sessionID), gameID: this.game._id, roundID: this.round._id },
        },
        {
          $set: {
            cashoutCoef: coef,
            balanceAfter: {
              $add: ['$balance', { $multiply: ['$amount', coef] }],
            },
            status: BetStatus.WON,
          },
        },
      ])
    )?.[0];

    if (!updatedBet) {
      return;
    }

    const betID = updatedBet._id;
    delete updatedBet._id;
    updatedBet.balanceAfter = updatedBet.balanceAfter.toFixed(2);

    await this.betsModel.updateOne({ _id: betID }, { ...updatedBet });
    await this.playersModel.updateOne({ _id: updatedBet.playerID }, { balance: updatedBet.balanceAfter });

    return updatedBet;
  }

  async endRound() {
    this.round.endedAt = new Date();
    this.round.status = RoundStatus.COMPLETED;
    return this.round.save();
  }

  async getSessionByID(sessionID: string): Promise<Session> {
    return this.sessionsModel.findOne({ _id: sessionID });
  }

  async getPlayerBySessionID(sessionID: string): Promise<Player> {
    const session = await this.getSessionByID(sessionID);
    if (!session) {
      return null;
    }

    return this.playersModel.findOne({ _id: session.playerID });
  }
}

export default GameService;
