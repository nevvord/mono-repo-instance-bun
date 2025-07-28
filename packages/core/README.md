# @mono-repo/core

Core package containing shared configuration, types, and utilities for the monorepo.

## Structure

```
packages/core/
├── index.ts           # Main entry point (re-exports only)
├── config/            # Configuration system
│   ├── index.ts       # Config entry point
│   ├── validate-config.ts # Config validation
│   └── types/config.ts # Config types
├── types/             # Shared type definitions
│   └── index.ts       # Types entry point
├── utils/             # Shared utility functions
│   └── index.ts       # Utils entry point
├── package.json       # Package configuration
├── tsconfig.json      # TypeScript configuration
└── README.md          # This file
```

## Installation

This package is automatically available in the workspace. No manual installation needed.

## Usage

### Configuration

```typescript
import { config } from "@mono-repo/core/config";

const dbUrl = config.database.url;
const port = config.app.port;
```

### Types

```typescript
import type { Config } from "@mono-repo/core/types";

const myConfig: Config = {
  // ... config object
};
```

### Utils

```typescript
import /* utility functions */ "@mono-repo/core/utils";
```

## Development

```bash
# Type checking
bun run type-check

# Development mode
bun run dev

# Build
bun run build
```

## Adding New Modules

1. Create the module directory and files following kebab-case naming
2. Add the module to the appropriate index.ts file
3. Update exports in package.json if needed
4. Document the new module in this README
