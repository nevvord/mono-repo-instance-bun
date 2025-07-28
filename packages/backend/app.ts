import { Hono } from 'hono';
import { healthRouter, authRouter, sessionRouter } from './routers';
import { prisma } from './lib';
import { createLogger } from '@mono-repo/core/utils';
import { loggerMiddleware, requestBodyLogger } from './middleware';

// Initialize logger and Prisma client
const logger = createLogger('Backend');
logger.start('Initializing Prisma client...');
// Ensure Prisma client is initialized by accessing it
prisma.$connect().catch(error => {
  logger.fail('Failed to connect to database', { error: error.message });
});

// Create Hono app instance
const app = new Hono();

// Add logging middleware
app.use('*', loggerMiddleware);

// Add request body logging in development
if (process.env.NODE_ENV === 'development') {
  app.use('*', requestBodyLogger);
}

// Mount routers with v1 prefix
app.route('/v1', healthRouter);
app.route('/v1/auth', authRouter);
app.route('/v1/sessions', sessionRouter);

// 404 handler
app.notFound(c => {
  logger.warn('404 - Resource not found', {
    url: c.req.url,
    method: c.req.method,
    userAgent: c.req.header('User-Agent'),
  });

  return c.json(
    {
      error: 'Not Found',
      message: 'The requested resource was not found',
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  logger.fail('Server error occurred', {
    error: err instanceof Error ? err.message : 'Unknown error',
    stack: err instanceof Error ? err.stack : undefined,
    url: c.req.url,
    method: c.req.method,
  });

  return c.json(
    {
      error: 'Internal Server Error',
      message: 'Something went wrong',
    },
    500
  );
});

// Export app for testing and external use
export { app };
