import { NextFunction, Request, Response } from 'express';

import SessionService from '@services/session.service';
import GameService from '@services/game.service';
import PlayerService from '@services/player.service';

import { NoActiveGame } from '@exceptions/NoActiveGame';

class GameController {
  private gameService: GameService = new GameService();
  private sessionService: SessionService = new SessionService();
  private playerService: PlayerService = new PlayerService();

  public init = async (_: Request, res: Response, next: NextFunction) => {
    try {
      const game = await this.gameService.getActiveGame();

      if (!game) {
        throw new NoActiveGame();
      }

      const player = await this.playerService.getOrCreatePlayer();
      const session = await this.sessionService.create(game._id, player._id);

      res.json({
        sessionID: session._id,
      });
    } catch (error) {
      next(error);
    }
  };

  public getConfig = async (_: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.gameService.getConfig());
    } catch (error) {
      next(error);
    }
  };
}

export default GameController;
