import dotenv from 'dotenv';
import path from 'path';

import env from './env';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export const config = {
  NODE_ENV: env('NODE_ENV', 'development'),
  PORT: parseInt(env('PORT', '3000'), 10),
  LOCAL_MONGO_URI: env('LOCAL_MONGO_URI', 'mongodb://localhost:27017/app'),
  CLOUD_MONGO_URI: env('CLOUD_MONGO_URI', 'mongodb://localhost:27017/app'),
  JWT_ACCESS_SECRET: env('JWT_ACCESS_SECRET', 'your-secret-key'),
  JWT_EXPIRES_IN: env('JWT_EXPIRES_IN', '7d'),
  LOG_LEVEL: env('LOG_LEVEL', 'info'),
  CORS_ORIGIN: env('CORS_ORIGIN', '*'),
};

export { default as connectDB } from './db';
export { default as env } from './env';
