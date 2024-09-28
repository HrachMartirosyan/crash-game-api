import { Router } from 'express';

import { Routes } from '@interfaces/routes.interface';
import PlayerController from '@controllers/player.controller';
import RequestValidator from '@/validators/request.validator';

class PlayerRoute implements Routes {
  public path = '/player';
  public router = Router();

  private playerController = new PlayerController();
  private validator = new RequestValidator();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-ignore
    this.router.get(`${this.path}`, this.validator.validateSession, this.playerController.getPlayer);
  }
}

export default PlayerRoute;
