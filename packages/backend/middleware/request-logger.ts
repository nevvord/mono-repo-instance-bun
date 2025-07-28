import { Context, Next } from 'hono';
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('RequestBody');

export const requestBodyLogger = async (c: Context, next: Next) => {
  const method = c.req.method;
  const url = c.req.url;

  // Only log body for POST/PUT/PATCH requests
  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    try {
      const contentType = c.req.header('Content-Type');

      if (contentType?.includes('application/json')) {
        const body = await c.req.json();
        logger.debug('Request body', {
          method,
          url,
          body: JSON.stringify(body),
        });
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const body = await c.req.formData();
        const formData = Object.fromEntries(body.entries());
        logger.debug('Form data', {
          method,
          url,
          formData: JSON.stringify(formData),
        });
      }
    } catch (error) {
      // Ignore body parsing errors in logging
      logger.debug('Could not parse request body', {
        method,
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  await next();
};
