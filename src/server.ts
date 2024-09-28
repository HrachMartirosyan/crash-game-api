import App from '@/app';

import IndexRoute from '@routes/index.route';

import validateEnv from '@utils/validateEnv';
import GameRoute from '@routes/game.route';
import PlayerRoute from '@routes/player.route';

validateEnv();

const app = new App([new IndexRoute(), new PlayerRoute(), new GameRoute()]);

app.listen();
