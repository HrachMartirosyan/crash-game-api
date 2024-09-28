import { RequestWithPlayer } from '@interfaces/routes.interface';
import { NextFunction, Response } from 'express';

class PlayerController {
  public getPlayer = async (req: RequestWithPlayer, res: Response, next: NextFunction) => {
    try {
      res.json(req.player);
    } catch (error) {
      next(error);
    }
  };
}

export default PlayerController;
