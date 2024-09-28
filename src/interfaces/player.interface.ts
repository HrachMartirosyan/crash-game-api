import { Document } from 'mongoose';

export interface Player extends Document {
  _id: string;
  createdAt: Date;
  username: string;
  balance: number;
}
