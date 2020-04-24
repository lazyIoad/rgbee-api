import app from './app';
import { logger } from './helpers/logger-helper';
import { ENVIRONMENT, PORT } from './utils/secrets-util';

app.listen(PORT, () => {
  logger.info(`App is running at http://localhost:${PORT} in ${ENVIRONMENT} mode`);
  logger.info('Press CTRL-C to stop');
});
