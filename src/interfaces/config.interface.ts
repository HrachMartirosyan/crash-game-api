import { Document } from 'mongoose';

export interface Config extends Document {
  minBet: number;
  maxBet: number;
  bets: number[];
  createdAt: Date;
}
