import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { validateConfig } from './validate-config';

describe('validateConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return valid config with all required variables', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'development';
    process.env.PORT = '3000';

    const config = validateConfig();

    expect(config).toBeDefined();
    expect(config.database.url).toBe(
      'postgresql://user:pass@localhost:5432/db'
    );
    expect(config.jwt.secret).toBe('test-secret');
    expect(config.app.nodeEnv).toBe('development');
    expect(config.app.port).toBe(3000);
  });

  it('should use default values for NODE_ENV and PORT', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-secret';
    delete process.env.NODE_ENV;
    delete process.env.PORT;

    const config = validateConfig();

    expect(config.app.nodeEnv).toBe('development');
    expect(config.app.port).toBe(3000);
  });

  it('should throw error for missing DATABASE_URL', () => {
    delete process.env.DATABASE_URL;
    process.env.JWT_SECRET = 'test-secret';

    expect(() => validateConfig()).toThrow(
      'Missing required environment variables: DATABASE_URL'
    );
  });

  it('should throw error for missing JWT_SECRET', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    delete process.env.JWT_SECRET;

    expect(() => validateConfig()).toThrow(
      'Missing required environment variables: JWT_SECRET'
    );
  });

  it('should throw error for invalid NODE_ENV', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.NODE_ENV = 'invalid';

    expect(() => validateConfig()).toThrow(
      'Invalid NODE_ENV: invalid. Must be one of: development, production, test'
    );
  });

  it('should throw error for invalid PORT', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.PORT = 'invalid';

    expect(() => validateConfig()).toThrow(
      'Invalid PORT: invalid. Must be a number between 1 and 65535'
    );
  });

  it('should throw error for PORT out of range', () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';
    process.env.JWT_SECRET = 'test-secret';
    process.env.PORT = '70000';

    expect(() => validateConfig()).toThrow(
      'Invalid PORT: 70000. Must be a number between 1 and 65535'
    );
  });
});
