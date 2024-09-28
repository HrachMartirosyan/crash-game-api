import { model, Schema, Document } from 'mongoose';
import { Game } from '@interfaces/game.interface';

const gameSchema: Schema = new Schema({
  configID: { type: Schema.Types.ObjectId, ref: 'config' },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
});

const GameModel = model<Game & Document>('game', gameSchema);

export default GameModel;
