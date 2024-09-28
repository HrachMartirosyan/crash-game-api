import { connect, set, disconnect } from 'mongoose';

import { MONGO_DB_USERNAME, MONGO_DB_PASSWORD, MONGO_DB_HOST, MONGO_DB_PORT, MONGO_DB_DATABASE, NODE_ENV } from '@config';
import { DB } from './abstract.db';

export class MongoDB extends DB {
  private readonly credentials = MONGO_DB_USERNAME && MONGO_DB_PASSWORD ? `${MONGO_DB_USERNAME}:${encodeURIComponent(MONGO_DB_PASSWORD)}@` : '';
  private config = {
    url: `mongodb://${this.credentials}${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_DATABASE}`,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };

  public async connect() {
    if (NODE_ENV !== 'production') {
      set('debug', true);
    }

    await connect(this.config.url);

    console.log('💿 Connected to MongoDB');
  }

  public async disconnect() {
    await disconnect();
    console.log('✂️ Disconnected from MongoDB');
  }
}
