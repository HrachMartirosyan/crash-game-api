import GameModel from '@models/mongodb/game.model';
import ConfigModel from '@models/mongodb/config.model';

import { Game } from '@interfaces/game.interface';
import { Config } from '@interfaces/config.interface';

class GameService {
  private gamesModel = GameModel;
  private configsModel = ConfigModel;

  async getConfig(): Promise<Config | null> {
    return this.configsModel.findOne({});
  }

  async getActiveGame(): Promise<Game | null> {
    return this.gamesModel.findOne({}).sort({ createdAt: -1 });
  }
}

export default GameService;
