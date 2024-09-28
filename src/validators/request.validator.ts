import { NextFunction, Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SessionHeaderDto } from '@/dto/headers.dto';
import { RequestWithPlayer } from '@interfaces/routes.interface';
import { Unauthorized } from '@exceptions/Unauthorized';
import PlayerService from '@services/player.service';

function transformValidationErrorsToJSON(errors: ValidationError[]) {
  return errors.reduce((p, c: ValidationError) => {
    if (!c.children || !c.children.length) {
      p[c.property] = Object.keys(c.constraints).map(key => c.constraints[key]);
    } else {
      p[c.property] = transformValidationErrorsToJSON(c.children);
    }
    return p;
  }, {});
}

class RequestValidator {
  private playerService = new PlayerService();

  validateSession = async (req: RequestWithPlayer, _res: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const errors = await validate(plainToInstance(SessionHeaderDto, req.headers));

      if (errors.length > 0) {
        throw new Unauthorized('Unauthorized');
      }

      // @ts-ignore
      const sessionID = req.headers['session-id'];

      try {
        req.sessionID = sessionID;
        req.player = await this.playerService.getPlayerBySessionID(sessionID);
        next();
      } catch (e) {
        console.error(e);
        throw new Unauthorized('Unauthorized');
      }
    } catch (e) {
      next(e);
    }
  };

  validateBody(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const errors = await validate(plainToInstance(dto, req.body));

      if (errors.length > 0) {
        res.status(400).json(transformValidationErrorsToJSON(errors));
        return;
      }

      next();
    };
  }

  validateHeaders(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const errors = await validate(plainToInstance(dto, req.headers));

      if (errors.length > 0) {
        res.status(400).json(transformValidationErrorsToJSON(errors));
        return;
      }

      next();
    };
  }

  validateQuery(dto: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const errors = await validate(plainToInstance(dto, req.query));

      if (errors.length > 0) {
        res.status(400).json(transformValidationErrorsToJSON(errors));
        return;
      }

      next();
    };
  }
}

export default RequestValidator;
