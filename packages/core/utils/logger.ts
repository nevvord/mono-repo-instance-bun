export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogContext {
  [key: string]: any;
}

class Logger {
  private level: LogLevel;
  private service: string;

  constructor(service: string, level: LogLevel = LogLevel.INFO) {
    this.service = service;
    this.level = level;
  }

  private formatMessage(
    level: string,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] ${level} | ${this.service} | ${message}${contextStr}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message, context));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message, context));
    }
  }

  // Convenience methods for common operations
  start(message: string, context?: LogContext): void {
    this.info(`🚀 ${message}`, context);
  }

  success(message: string, context?: LogContext): void {
    this.info(`✅ ${message}`, context);
  }

  fail(message: string, context?: LogContext): void {
    this.error(`❌ ${message}`, context);
  }

  database(message: string, context?: LogContext): void {
    this.info(`🗄️ ${message}`, context);
  }

  network(message: string, context?: LogContext): void {
    this.info(`🌐 ${message}`, context);
  }

  security(message: string, context?: LogContext): void {
    this.warn(`🔐 ${message}`, context);
  }

  // Method to change log level at runtime
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  // Method to get current log level
  getLevel(): LogLevel {
    return this.level;
  }
}

// Factory function to create logger instances
export const createLogger = (service: string, level?: LogLevel): Logger => {
  return new Logger(service, level);
};

// Default logger instance
export const logger = createLogger('Core');

// Export the Logger class for custom instances
export { Logger };
