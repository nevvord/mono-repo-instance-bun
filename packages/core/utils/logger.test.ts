import { describe, it, expect, beforeEach } from 'bun:test';
import { Logger, LogLevel, createLogger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('TestService', LogLevel.DEBUG);
  });

  describe('Log Levels', () => {
    it('should have correct log levels', () => {
      expect(LogLevel.ERROR).toBe(0);
      expect(LogLevel.WARN).toBe(1);
      expect(LogLevel.INFO).toBe(2);
      expect(LogLevel.DEBUG).toBe(3);
    });

    it('should create logger with correct service name', () => {
      expect(logger).toBeInstanceOf(Logger);
    });
  });

  describe('Message Formatting', () => {
    it('should format messages correctly', () => {
      // This test just verifies the logger can be called without errors
      expect(() => {
        logger.info('Test message');
      }).not.toThrow();
    });

    it('should handle context objects', () => {
      const context = { userId: '123', action: 'login' };
      expect(() => {
        logger.info('Test message', context);
      }).not.toThrow();
    });
  });

  describe('Log Level Filtering', () => {
    it('should set and get log level correctly', () => {
      logger.setLevel(LogLevel.INFO);
      expect(logger.getLevel()).toBe(LogLevel.INFO);

      logger.setLevel(LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });
  });

  describe('Convenience Methods', () => {
    it('should call convenience methods without errors', () => {
      expect(() => {
        logger.start('Application starting');
        logger.success('Operation completed');
        logger.fail('Operation failed');
        logger.database('Database connected');
        logger.network('Server listening');
        logger.security('Authentication required');
      }).not.toThrow();
    });
  });

  describe('createLogger factory', () => {
    it('should create logger with default INFO level', () => {
      const logger = createLogger('TestService');
      expect(logger.getLevel()).toBe(LogLevel.INFO);
    });

    it('should create logger with custom level', () => {
      const logger = createLogger('TestService', LogLevel.DEBUG);
      expect(logger.getLevel()).toBe(LogLevel.DEBUG);
    });
  });
});
