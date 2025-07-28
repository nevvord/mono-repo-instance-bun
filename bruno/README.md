# Bruno API Documentation

This directory contains API documentation and testing files for the Mono Repository backend API.

## Structure

```
bruno/
├── collections/
│   └── api/
│       ├── auth/           # Authentication endpoints
│       │   ├── post-register.bru
│       │   └── post-login.bru
│       └── health/         # Health check endpoints
│           └── get-health.bru
├── environments/
│   ├── local.bru          # Local development environment
│   └── production.bru     # Production environment
└── bruno.json             # Bruno configuration
```

## API Endpoints

### Authentication (`/auth`)

#### POST `/v1/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

- `201 Created`: User registered successfully
- `400 Bad Request`: Validation errors
- `500 Internal Server Error`: Server errors

#### POST `/v1/auth/login`

Authenticate user and receive session token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

- `200 OK`: Login successful with session token in cookie
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid credentials or inactive account
- `500 Internal Server Error`: Server errors

### Sessions (`/sessions`)

#### GET `/v1/sessions`

Get all active sessions for the authenticated user.

**Authentication:** Requires session token in cookie

**Response:**

- `200 OK`: List of user sessions
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Server errors

#### GET `/v1/sessions/:sessionId`

Get information about a specific session.

**Authentication:** Requires session token in cookie

**Response:**

- `200 OK`: Session information
- `400 Bad Request`: Session ID required
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server errors

#### DELETE `/v1/sessions/:sessionId`

Terminate a specific session.

**Authentication:** Requires session token in cookie

**Response:**

- `200 OK`: Session terminated successfully
- `400 Bad Request`: Session ID required
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Session not found
- `500 Internal Server Error`: Server errors

#### DELETE `/v1/sessions`

Terminate all sessions for the authenticated user.

**Authentication:** Requires session token in cookie

**Response:**

- `200 OK`: All sessions terminated
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Server errors

#### POST `/v1/sessions/logout`

Logout current user (terminate current session).

**Authentication:** Requires session token in cookie

**Response:**

- `200 OK`: Logged out successfully
- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Server errors

### Health Check (`/health`)

#### GET `/v1/health`

Check API server health status.

**Response:**

- `200 OK`: Server is healthy
- `500 Internal Server Error`: Server is unhealthy

## Environment Variables

### Local Development

- `base_url`: `http://localhost:3000`

### Production

- `base_url`: `https://api.yourdomain.com`

## Usage

1. Install Bruno extension in VS Code
2. Open the `bruno` folder in Bruno
3. Select environment (local/production)
4. Run requests to test API endpoints
5. View documentation in the docs section of each request

## Testing Workflow

1. **Health Check**: Verify server is running
2. **Register**: Create a new user account
3. **Login**: Authenticate and get session token
4. **Use Token**: Include token in subsequent requests

## Security Notes

- All passwords are hashed using bcrypt
- Session tokens are cryptographically secure
- Sessions expire after 24 hours
- User agent and IP are logged for security
- Input validation is performed on all endpoints
