import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@config';
import { JWTPayload, RequestWithUser } from '@interfaces/routes.interface';

export function getJWTTokenData(req: RequestWithUser, res: Response, next: NextFunction) {
  // @ts-ignore
  const { authorization } = req.headers;
  if (!authorization) {
    next();
    return;
  }

  const split = authorization.split(' ');
  const token = split[1] || '';

  req.user = jwt.verify(token, JWT_SECRET) as JWTPayload;
  next();
}
