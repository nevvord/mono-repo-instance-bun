// Validate and parse environment variables into typed config

import type { Config } from "./types/config";

export function validateConfig(): Config {
  const requiredVars = {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || "3000",
  };

  // Check for missing required variables
  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value && key !== "NODE_ENV" && key !== "PORT")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  // Validate NODE_ENV
  const validNodeEnvs = ["development", "production", "test"];
  if (!validNodeEnvs.includes(requiredVars.NODE_ENV)) {
    throw new Error(
      `Invalid NODE_ENV: ${
        requiredVars.NODE_ENV
      }. Must be one of: ${validNodeEnvs.join(", ")}`
    );
  }

  // Validate PORT
  const port = parseInt(requiredVars.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    throw new Error(
      `Invalid PORT: ${requiredVars.PORT}. Must be a number between 1 and 65535`
    );
  }

  return {
    database: {
      url: requiredVars.DATABASE_URL!,
    },
    jwt: {
      secret: requiredVars.JWT_SECRET!,
    },
    app: {
      nodeEnv: requiredVars.NODE_ENV as "development" | "production" | "test",
      port,
    },
  };
}
