import { model, Schema, Document } from 'mongoose';
import { Config } from '@interfaces/config.interface';

const configSchema: Schema = new Schema({
  minBet: { type: Number, required: true },
  maxBet: { type: Number, required: true },
  delta: { type: Number, required: true },
  bets: [{ type: Number, required: true }],
  createdAt: { type: Date, default: Date.now },
});

const ConfigModel = model<Config & Document>('config', configSchema);

export default ConfigModel;
