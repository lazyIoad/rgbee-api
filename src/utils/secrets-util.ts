import dotenv from 'dotenv';
import fs from 'fs';
import { logger } from '../helpers/logger-helper';

if (fs.existsSync('.env')) {
  logger.debug('Using .env file to supply config environment variables');
  dotenv.config({ path: '.env' });
}

export const ENVIRONMENT = process.env.NODE_ENV || 'development';
export const { SESSION_SECRET, PORT } = process.env;

if (!SESSION_SECRET) {
  logger.error('No client secret. Set SESSION_SECRET environment variable.');
  process.exit(1);
}
