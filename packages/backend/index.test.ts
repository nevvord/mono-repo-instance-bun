import { describe, it, expect } from 'bun:test';
import { config } from '@mono-repo/core';

// Import your app (you'll need to export it from index.ts)
// import { app } from './index';

describe('Backend API', () => {
  it('should have valid configuration', () => {
    expect(config).toBeDefined();
    expect(config.app).toBeDefined();
    expect(config.app.port).toBeGreaterThan(0);
    expect(config.app.port).toBeLessThan(65536);
  });

  it('should have database configuration', () => {
    expect(config.database).toBeDefined();
    expect(config.database.url).toBeDefined();
    expect(typeof config.database.url).toBe('string');
  });

  it('should have JWT configuration', () => {
    expect(config.jwt).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(typeof config.jwt.secret).toBe('string');
  });

  // Example test for API endpoints (when you export the app)
  /*
  it('should respond to health check', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    
    const data = await res.json();
    expect(data).toEqual({ status: 'ok' });
  });

  it('should handle 404 routes', async () => {
    const res = await app.request('/nonexistent');
    expect(res.status).toBe(404);
  });
  */
});
