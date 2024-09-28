import { config } from 'dotenv';
const env = process.env.NODE_ENV || 'development';

config({ path: `.env.${env}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const {
  NODE_ENV = env,
  PORT,
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD,
  MONGO_DB_HOST,
  MONGO_DB_PORT,
  MONGO_DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  JWT_SECRET,
} = process.env;
