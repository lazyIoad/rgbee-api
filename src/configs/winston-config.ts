import winston from 'winston';

const options: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.json(),
  transports:
    process.env.NODE_ENV === 'production'
      ? [
          // Write all logs with level `error` and below to `error.log`
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          // Write all logs with level `info` and below to `combined.log`
          new winston.transports.File({ filename: 'logs/combined.log', level: 'info' }),
        ]
      : // If in development, log to console instead
        [new winston.transports.Console({ format: winston.format.simple() })],
};

export default options;
