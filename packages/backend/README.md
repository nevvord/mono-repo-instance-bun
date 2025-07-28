# Backend Package

Backend API server built with Hono framework and Prisma ORM.

## Architecture

### Global Prisma Client

The Prisma client is initialized globally in `app.ts` and shared across all services:

```typescript
// lib/prisma.ts
import { PrismaClient } from '../../../.pro/prisma/index';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

This approach:

- Prevents multiple Prisma client instances in development
- Improves performance by reusing connections
- Ensures consistent database access across the application

### Comprehensive Logging System

The backend implements a comprehensive logging system with multiple layers:

#### 1. HTTP Request/Response Logging

All HTTP requests and responses are automatically logged with:

- Request method, URL, user agent, IP address
- Response status, response time
- Error details for failed requests

```typescript
// middleware/logger-middleware.ts
export const loggerMiddleware = async (c: Context, next: Next) => {
  const startTime = Date.now();
  // Log incoming request
  // Process request
  // Log response with timing
};
```

#### 2. Request Body Logging (Development Only)

In development mode, request bodies are logged for debugging:

```typescript
// middleware/request-logger.ts
export const requestBodyLogger = async (c: Context, next: Next) => {
  // Log JSON and form data for POST/PUT/PATCH requests
};
```

#### 3. Controller-Level Logging

Each controller logs its operations:

```typescript
// controllers/auth-controller.ts
const logger = createLogger('AuthController');

export const register = async (c: Context) => {
  logger.info('Registration request received', { email });
  // Process registration
  logger.success('Registration completed successfully', { email, userId });
};
```

#### 4. Service-Level Logging

Business logic operations are logged:

```typescript
// services/user-service.ts
const logger = createLogger('UserService');

export const registerUser = async (data: RegisterUserData) => {
  logger.info('Attempting to register new user', { email: data.email });
  // Process registration
  logger.success('User registered successfully', {
    userId: user.id,
    email: user.email,
  });
};
```

#### 5. Error Logging

All errors are logged with full context:

```typescript
// app.ts
app.onError((err, c) => {
  logger.fail('Server error occurred', {
    error: err.message,
    stack: err.stack,
    url: c.req.url,
    method: c.req.method,
  });
});
```

### File Structure

```
packages/backend/
├── app.ts                 # Main application setup with Prisma initialization
├── server.ts              # Server startup configuration
├── index.ts               # Entry point
├── lib/                   # Shared libraries
│   ├── prisma.ts         # Global Prisma client instance
│   └── index.ts          # Library exports
├── middleware/           # HTTP middleware
│   ├── logger-middleware.ts # Request/response logging
│   ├── request-logger.ts    # Request body logging (dev only)
│   └── index.ts          # Middleware exports
├── services/             # Business logic
│   ├── user-service.ts   # User management operations
│   └── index.ts         # Service exports
├── controllers/          # HTTP request handlers
│   ├── auth-controller.ts # Authentication endpoints
│   ├── health-controller.ts # Health check endpoint
│   └── index.ts         # Controller exports
└── routers/             # Route definitions
    ├── auth-router.ts    # Authentication routes
    └── index.ts         # Router exports
```

## API Endpoints

### Health Check

#### GET /v1/health

Returns server health status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-07-29T18:50:30.850Z",
  "environment": "development"
}
```

### Authentication

#### POST /v1/auth/register

Register a new user.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "cmdovnkjd0000gwtu6dwfwy20",
    "email": "user@example.com",
    "username": "user@example.com",
    "isActive": true,
    "isVerified": false,
    "role": "USER",
    "createdAt": "2025-07-29T18:35:36.505Z"
  }
}
```

**Validation:**

- Email must be valid format
- Password must be at least 6 characters
- Email must be unique

## Logging Examples

### Successful Request Flow

```
[2025-07-29T18:50:42.032Z] INFO | HTTP | Incoming request | {"method":"POST","url":"http://localhost:3000/v1/auth/register","userAgent":"curl/8.5.0","ip":"Unknown"}
[2025-07-29T18:50:42.032Z] INFO | AuthController | Registration request received | {"email":"user@example.com"}
[2025-07-29T18:50:42.032Z] INFO | UserService | Attempting to register new user | {"email":"user@example.com"}
[2025-07-29T18:50:42.034Z] INFO | UserService | ✅ User registered successfully | {"userId":"123","email":"user@example.com"}
[2025-07-29T18:50:42.034Z] INFO | AuthController | ✅ Registration completed successfully | {"email":"user@example.com","userId":"123"}
[2025-07-29T18:50:42.034Z] INFO | HTTP | ✅ Request completed | {"method":"POST","url":"http://localhost:3000/v1/auth/register","status":201,"responseTime":"2ms"}
```

### Error Flow

```
[2025-07-29T18:50:42.032Z] INFO | HTTP | Incoming request | {"method":"POST","url":"http://localhost:3000/v1/auth/register","userAgent":"curl/8.5.0","ip":"Unknown"}
[2025-07-29T18:50:42.032Z] INFO | AuthController | Registration request received | {"email":"user@example.com"}
[2025-07-29T18:50:42.032Z] INFO | UserService | Attempting to register new user | {"email":"user@example.com"}
[2025-07-29T18:50:42.034Z] WARN | UserService | Registration failed: user already exists | {"email":"user@example.com"}
[2025-07-29T18:50:42.034Z] WARN | AuthController | Registration failed | {"email":"user@example.com","error":"User with this email already exists"}
[2025-07-29T18:50:42.034Z] INFO | HTTP | ✅ Request completed | {"method":"POST","url":"http://localhost:3000/v1/auth/register","status":400,"responseTime":"2ms"}
```

### 404 Error

```
[2025-07-29T18:50:42.032Z] INFO | HTTP | Incoming request | {"method":"GET","url":"http://localhost:3000/nonexistent","userAgent":"curl/8.5.0","ip":"Unknown"}
[2025-07-29T18:50:42.032Z] WARN | Backend | 404 - Resource not found | {"url":"http://localhost:3000/nonexistent","method":"GET","userAgent":"curl/8.5.0"}
[2025-07-29T18:50:42.032Z] INFO | HTTP | ✅ Request completed | {"method":"GET","url":"http://localhost:3000/nonexistent","status":404,"responseTime":"1ms"}
```

## Development

### Running Tests

```bash
cd packages/backend
bun test
```

### Starting Development Server

```bash
# Via PM2 (recommended)
pm2 start mono-repo-backend

# Direct
cd packages/backend
bun run dev
```

## Database

The backend uses PostgreSQL with Prisma ORM. The database connection is configured via `DATABASE_URL` environment variable.

### Prisma Commands

```bash
# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate dev --name <migration-name>

# Open Prisma Studio
bunx prisma studio
```

## Logging Configuration

### Log Levels

- **ERROR**: Critical errors and failures
- **WARN**: Warnings and non-critical issues
- **INFO**: General information and successful operations
- **DEBUG**: Detailed debugging information (development only)

### Log Format

```
[timestamp] LEVEL | Service | Message | {"context":"data"}
```

### Development vs Production

- **Development**: Full logging including request bodies and debug information
- **Production**: Essential logging only (INFO, WARN, ERROR levels)
