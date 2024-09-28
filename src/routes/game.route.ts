import { Router } from 'express';

import GameController from '@controllers/game.controller';
import { Routes } from '@interfaces/routes.interface';

class GameRoute implements Routes {
  public path = '/game';
  public router = Router();
  public gameController = new GameController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/config`, this.gameController.getConfig);
    this.router.post(`${this.path}/init`, this.gameController.init);
  }
}

export default GameRoute;
