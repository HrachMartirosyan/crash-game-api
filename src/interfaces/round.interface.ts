import { Document } from 'mongoose';

export enum RoundStatus {
  BETTING = 'BETTING',
  EXECUTING = 'EXECUTING',
  COMPLETED = 'COMPLETED',
}

export interface Round extends Document {
  _id: string;
  gameID: string;
  coef: number;
  createdAt: Date;
  endedAt?: Date;
  bettingClosedAt: string;
  status: RoundStatus;
}
