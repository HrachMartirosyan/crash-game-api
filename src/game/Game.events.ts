import { Server as NodeServer } from 'node:http';
import { DisconnectReason, Server, Socket } from 'socket.io';
import GameService from '@/game/Game.service';
import { ORIGIN } from '@config';
import { RoundStatus } from '@interfaces/round.interface';
import { Player } from '@interfaces/player.interface';

enum ServerEvents {
  GAME_STARTER_DATA = 'gameStarterData',
  ROUND_STATUS_CHANGED = 'roundStatusChanged',
  COEF = 'coef',
  BALANCE = 'balance',
  BET_PLACED = 'betPlaced',
}

enum ClientEvents {
  BET = 'bet',
  CASHOUT = 'cashout',
}

class GameEvents {
  private io: Server;
  private _room: string;

  private gameService: GameService;

  constructor(nodeServer: NodeServer, gameService: GameService) {
    this.gameService = gameService;

    this.io = new Server(nodeServer, {
      cors: {
        origin: ORIGIN,
      },
    });

    this.addMiddlewares();
    this.handleConnections();
  }

  set room(id: string) {
    this._room = id;
  }

  get room() {
    return this._room;
  }

  private addMiddlewares() {
    this.io.use(async (socket: any, next) => {
      const token = this.getToken(socket);

      if (!token || !(await this.gameService.validateSession(token))) {
        next(new Error('Invalid session'));
        return;
      }

      next();
    });
  }

  private getToken(socket: Socket): string | undefined {
    return socket.handshake?.auth?.token;
  }

  private handleConnections() {
    this.io.on('connection', this.onConnection);
  }

  private onConnection = (socket: Socket) => {
    if (!this.room) {
      return;
    }

    socket.on('disconnect', this.onSocketDisconnect);

    this.sendStarterData(socket);
    this.joinToRoom(socket);
    this.handleBets(socket);
    this.handleCashout(socket);
  };

  private sendStarterData(socket: Socket) {
    socket.emit(ServerEvents.GAME_STARTER_DATA, {
      roundStatus: this.gameService.getRoundStatus(),
    });
  }

  private joinToRoom = (socket: Socket) => {
    socket.join(this.room);
  };

  private handleBets(socket: Socket) {
    socket.on(ClientEvents.BET, (bet: BetEmit) => this.onBet(socket, bet));
  }

  private handleCashout(socket: Socket) {
    socket.on(ClientEvents.CASHOUT, (cashout: CashoutEmit) => this.onCashout(socket, cashout));
  }

  private onBet = async (socket: Socket, bet: BetEmit) => {
    if (!this.gameService.isBetValid(bet) || this.gameService.isBettingEnded()) {
      return;
    }

    const sessionID = this.getToken(socket);
    try {
      const player: Player = await this.gameService.acceptBet(bet, sessionID);

      if (!player) {
        return;
      }

      this.emitBetPlaced(bet.amount, player.balance);
    } catch (e) {
      console.error('Can not accept bet', e);
    }
  };

  private onCashout = async (socket: Socket, cashout: CashoutEmit) => {
    if (!this.gameService.checkCashoutCoef(cashout.coef)) {
      return;
    }

    const sessionID = this.getToken(socket);
    const bet = await this.gameService.doCashout(sessionID, cashout.coef);

    if (bet) {
      this.emitBalance(bet.balanceAfter);
    }
  };

  private onSocketDisconnect = (reason: DisconnectReason, description: unknown) => {};

  public streamCoef(coef: number): void {
    this.io.to(this.room).emit(ServerEvents.COEF, coef);
  }

  public sendRoundStatus(status: RoundStatus): void {
    this.io.to(this.room).emit(ServerEvents.ROUND_STATUS_CHANGED, {
      roundStatus: status,
    });
  }

  private emitBalance(balance: number): void {
    this.io.to(this.room).emit(ServerEvents.BALANCE, {
      balance,
    });
  }

  private emitBetPlaced(bet: number, balance: number): void {
    this.io.to(this.room).emit(ServerEvents.BET_PLACED, {
      bet,
      balance,
    });
  }
}

export default GameEvents;
