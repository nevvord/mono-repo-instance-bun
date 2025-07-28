import { describe, it, expect, beforeAll } from 'bun:test';

describe('Backend API', () => {
  beforeAll(() => {
    // Set up test environment variables
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
    process.env.JWT_SECRET = 'test-secret-key-for-testing-only';
    process.env.NODE_ENV = 'test';
  });

  it('should have valid configuration', async () => {
    // Import config after setting environment variables
    const { config } = await import('@mono-repo/core');

    expect(config).toBeDefined();
    expect(config.app).toBeDefined();
    expect(config.app.port).toBeGreaterThan(0);
    expect(config.app.port).toBeLessThan(65536);
  });

  it('should have database configuration', async () => {
    // Import config after setting environment variables
    const { config } = await import('@mono-repo/core');

    expect(config.database).toBeDefined();
    expect(config.database.url).toBeDefined();
    expect(typeof config.database.url).toBe('string');
  });

  it('should have JWT configuration', async () => {
    // Import config after setting environment variables
    const { config } = await import('@mono-repo/core');

    expect(config.jwt).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(typeof config.jwt.secret).toBe('string');
  });
});
