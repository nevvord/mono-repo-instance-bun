import { Hono } from 'hono';
import { config } from '@mono-repo/core/config';

// Create Hono app instance
const app = new Hono();

// Health check endpoint
app.get('/health', c => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.app.nodeEnv,
  });
});

// API routes
app.get('/api/users', c => {
  return c.json({
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ],
  });
});

app.post('/api/users', async c => {
  const body = await c.req.json();

  return c.json(
    {
      message: 'User created successfully',
      user: {
        id: Math.floor(Math.random() * 1000),
        ...body,
        createdAt: new Date().toISOString(),
      },
    },
    201
  );
});

// 404 handler
app.notFound(c => {
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
  console.error('Server error:', err);

  return c.json(
    {
      error: 'Internal Server Error',
      message: 'Something went wrong',
    },
    500
  );
});

// Start server
// eslint-disable-next-line no-console
console.log(`🚀 Backend server starting on port ${config.app.port}`);
// eslint-disable-next-line no-console
console.log(`📊 Environment: ${config.app.nodeEnv}`);

export default {
  port: config.app.port,
  fetch: app.fetch,
};
