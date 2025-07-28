import { Context, Next } from 'hono';
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('HTTP');

export const loggerMiddleware = async (c: Context, next: Next) => {
  const startTime = Date.now();
  const method = c.req.method;
  const url = c.req.url;
  const userAgent = c.req.header('User-Agent') || 'Unknown';
  const ip =
    c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'Unknown';

  // Log incoming request
  logger.info('Incoming request', {
    method,
    url,
    userAgent,
    ip,
    timestamp: new Date().toISOString(),
  });

  try {
    // Process request
    await next();

    // Calculate response time
    const responseTime = Date.now() - startTime;
    const status = c.res.status;

    // Log successful response
    logger.success('Request completed', {
      method,
      url,
      status,
      responseTime: `${responseTime}ms`,
      userAgent,
      ip,
    });
  } catch (error) {
    // Calculate response time
    const responseTime = Date.now() - startTime;
    const status = c.res.status || 500;

    // Log error response
    logger.fail('Request failed', {
      method,
      url,
      status,
      responseTime: `${responseTime}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
      userAgent,
      ip,
    });

    // Re-throw error to be handled by error middleware
    throw error;
  }
};
