import { Router } from 'express';
import { Player } from '@interfaces/player.interface';

export interface Routes {
  path: string;
  router: Router;
}

export interface TypedRequest<T = any, U = unknown> extends Express.Request {
  body?: U;
  query?: T;
}

export interface RequestWithPlayer<T = any, U = unknown> extends TypedRequest<T, U> {
  sessionID: string;
  player: Player;
}
