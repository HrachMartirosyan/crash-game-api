import { model, Schema, Document } from 'mongoose';
import { Round } from '@interfaces/round.interface';

const roundSchema: Schema = new Schema({
  gameID: { type: Schema.Types.ObjectId, ref: 'game' },
  coef: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  bettingClosedAt: { type: Date },
  status: { type: String, enum: ['BETTING', 'EXECUTING', 'COMPLETED'], default: 'BETTING' },
  bets: [
    {
      createdAt: { type: Date, default: Date.now },
      sessionID: { type: Schema.Types.ObjectId, ref: 'session' },
      balance: { type: Number, required: true },
      amount: { type: Number, required: true },
      balanceAfter: { type: Number },
      status: { type: String, enum: ['PENDING', 'WON', 'LOST'], default: 'PENDING' },
    },
  ],
});

const RoundModel = model<Round & Document>('round', roundSchema);

export default RoundModel;
