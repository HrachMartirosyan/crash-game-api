import { model, Schema, Document } from 'mongoose';
import { Bet, BetStatus } from '@interfaces/bet.interface';

const betSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  gameID: { type: Schema.Types.ObjectId, ref: 'game', required: true },
  roundID: { type: Schema.Types.ObjectId, ref: 'round', required: true },
  sessionID: { type: Schema.Types.ObjectId, ref: 'session', required: true },
  playerID: { type: Schema.Types.ObjectId, ref: 'player', required: true },
  cashoutCoef: { type: Number },
  balance: { type: Number, required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  status: { type: String, enum: [BetStatus.LOST, BetStatus.WON], default: BetStatus.LOST },
});

const BetModel = model<Bet & Document>('bets', betSchema);

export default BetModel;
