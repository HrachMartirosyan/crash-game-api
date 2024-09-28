import { model, Schema, Document } from 'mongoose';
import { Player } from '@interfaces/player.interface';

const playerSchema: Schema = new Schema({
  balance: { type: Number, default: 50000 },
  username: { type: String, default: 'player1' },
  createdAt: { type: Date, default: Date.now },
});

const PlayerModel = model<Player & Document>('player', playerSchema);

export default PlayerModel;
