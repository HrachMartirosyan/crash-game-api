import PlayerModel from '@models/mongodb/player.model';
import SessionModel from '@models/mongodb/session.model';

import { Player } from '@interfaces/player.interface';
import { Session } from '@interfaces/session.interface';

class PlayerService {
  private playersModel = PlayerModel;
  private sessionsModel = SessionModel;

  async getOrCreatePlayer(): Promise<Player> {
    const existingPlayer = await this.findPlayer();

    if (existingPlayer) {
      return existingPlayer;
    }

    const player = new PlayerModel();
    return player.save();
  }

  async findPlayer(): Promise<Player | null> {
    return this.playersModel.findOne({});
  }

  async getPlayerBySessionID(sessionID: string): Promise<Player | null> {
    const session: Session = await this.sessionsModel.findOne({
      _id: sessionID,
    });

    if (!session) {
      return null;
    }

    return this.playersModel.findOne({ _id: session.playerID });
  }
}

export default PlayerService;
