import { model, Schema, Document } from 'mongoose';
import { Session } from '@interfaces/session.interface';

const sessionSchema: Schema = new Schema({
  gameID: { type: Schema.Types.ObjectId, ref: 'game' },
  playerID: { type: Schema.Types.ObjectId, ref: 'player' },
  createdAt: { type: Date, default: Date.now },
});

const SessionModel = model<Session & Document>('session', sessionSchema);

export default SessionModel;
