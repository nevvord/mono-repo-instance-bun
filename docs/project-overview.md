# Configuration Module

This directory contains the typed configuration system for the monorepo.

## Structure

```
config/
├── index.ts           # Re-exports only (entry point)
├── validate-config.ts # Config validation function
├── types/
│   └── config.ts      # Type definitions
└── README.md          # This file
```

## Usage

```typescript
import { config } from '../config';

// Access database URL with full type safety
const dbUrl = config.database.url;

// Access JWT secret
const jwtSecret = config.jwt.secret;

// Access app settings
const port = config.app.port;
const env = config.app.nodeEnv;
```

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `DATABASE_URL` - PostgreSQL connection string (required)
- `JWT_SECRET` - Secret key for JWT tokens (required)
- `NODE_ENV` - Application environment (development/production/test)
- `PORT` - Application port (default: 3000)

## Features

- **Type Safety** - All configuration values are typed
- **Validation** - Required variables are validated at startup
- **Error Handling** - Clear error messages for missing/invalid config
- **Singleton Pattern** - Configuration is loaded once and cached
- **File Organization** - Follows monorepo file organization rules

## Adding New Config

1. Update the `Config` interface in `types/config.ts`
2. Add validation logic in `validate-config.ts`
3. Update `.env.example` with new variables
4. Document the new variables in this README
