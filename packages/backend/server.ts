// Load environment variables from .env file first
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '../../.env') });

// Now import modules that depend on environment variables
import { app } from './app';
import { config } from '@mono-repo/core/config';

// Start server
// eslint-disable-next-line no-console
console.log(`🚀 Backend server starting on port ${config.app.port}`);
// eslint-disable-next-line no-console
console.log(`📊 Environment: ${config.app.nodeEnv}`);

try {
  Bun.serve({
    port: config.app.port,
    fetch: app.fetch,
  });
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
}
