import { Document } from 'mongoose';

export interface Game extends Document {
  _id: string;
  configID: string;
  createdAt: string;
  endedAt?: string;
}
