import { Server } from 'node:http';

import GameService from '@/game/Game.service';
import GameEvents from '@/game/Game.events';
import { GameRules } from '@/game/Game.rules';

import { Round } from '@interfaces/round.interface';
import { delay } from '@utils/timing';

class GameCore {
  private gameEvents: GameEvents;
  private readonly gameService: GameService;

  private closeBettingTimeout: NodeJS.Timeout;
  private roundInterval: NodeJS.Timeout;

  private rules: GameRules;

  constructor(
    server: Server,
    rules: GameRules = {
      bettingDuration: 7000,
      nextRoundIn: 5000,
      coefStreamingInterval: 200,
    },
  ) {
    this.rules = rules;

    this.gameService = new GameService();
    this.gameEvents = new GameEvents(server, this.gameService);

    this.init().then(() => {});
  }

  private async init(): Promise<void> {
    this.gameService.config = await this.gameService.checkConfig();
    this.gameService.game = await this.gameService.createGame();
    this.gameEvents.room = this.gameService.game._id;

    await this.start();
  }

  private async start(): Promise<void> {
    try {
      await this.createRound();

      this.sendRoundStatus();

      await this.closeBettingAfterTimeout();

      this.sendRoundStatus();

      await this.streamCoeffs();

      await this.end();

      this.sendRoundStatus();

      await delay(this.rules.nextRoundIn);

      await this.start();
    } catch (e) {
      console.error(e);
      this.stopRoundInterval();
      this.stopCloseBettingTimeout();
    }
  }

  private sendRoundStatus() {
    this.gameEvents.sendRoundStatus(this.gameService.getRoundStatus());
  }

  async closeBettingAfterTimeout() {
    return new Promise<void>(resolve => {
      this.closeBettingTimeout = setTimeout(async () => {
        await this.gameService.closeBetting();
        resolve();
      }, this.rules.bettingDuration);
    });
  }

  private streamCoeffs = async () => {
    this.gameService.generatedCoeffs = this.gameService.createCoeffs();
    let currentCoefIndex = 0;

    return new Promise<void>(resolve => {
      this.roundInterval = setInterval(() => {
        this.gameEvents.streamCoef(this.gameService.generatedCoeffs[currentCoefIndex]);
        currentCoefIndex += 1;

        if (currentCoefIndex === this.gameService.generatedCoeffs.length) {
          this.gameService.generatedCoeffs = [];
          this.stopRoundInterval();
          resolve();
        }
      }, this.rules.coefStreamingInterval);
    });
  };

  private async createRound(): Promise<Round> {
    this.gameService.round = await this.gameService.createRound();
    return this.gameService.round;
  }

  private stopRoundInterval() {
    clearInterval(this.roundInterval);
  }

  private stopCloseBettingTimeout() {
    clearTimeout(this.closeBettingTimeout);
  }

  private async end() {
    this.stopRoundInterval();
    this.stopCloseBettingTimeout();
    await this.gameService.endRound();
  }
}

export default GameCore;
