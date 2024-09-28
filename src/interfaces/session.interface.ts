import { Document } from 'mongoose';

export interface Session extends Document {
  playerID: string;
  createdAt: string;
}
