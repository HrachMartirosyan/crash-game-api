import SessionModel from '@models/mongodb/session.model';
import { Session } from '@interfaces/session.interface';

class SessionService {
  private sessionModel = SessionModel;

  async create(gameID: string, playerID: string): Promise<Session> {
    const session = new SessionModel({
      gameID,
      playerID,
    });
    return session.save();
  }
}

export default SessionService;
