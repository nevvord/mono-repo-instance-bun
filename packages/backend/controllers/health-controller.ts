import { Context } from 'hono';
import { config } from '@mono-repo/core/config';
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('HealthController');

export const getHealth = (c: Context) => {
  logger.info('Health check requested', {
    environment: config.app.nodeEnv,
    timestamp: new Date().toISOString(),
  });

  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
  };

  logger.success('Health check completed', {
    status: response.status,
    environment: response.environment,
  });

  return c.json(response);
};
