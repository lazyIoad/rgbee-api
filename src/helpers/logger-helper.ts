import winston from 'winston';
import winstonConfig from '../configs/winston-config';

export const logger = winston.createLogger(winstonConfig);

export const loggerStream = {
  write: (message: string): void => {
    logger.info(message);
  },
};
