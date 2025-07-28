import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { Hono } from 'hono';
import { register, login } from './auth-controller';

// Mock bcrypt
const mockBcrypt = {
  hash: mock(() => Promise.resolve('$2b$10$mocked.hash')),
  compare: mock(() => Promise.resolve(true)),
};

// Mock Prisma with proper typing
const mockPrisma = {
  user: {
    findFirst: mock(() => Promise.resolve(null)),
    create: mock(() => Promise.resolve({})),
  },
  session: {
    create: mock(() => Promise.resolve({})),
    findFirst: mock(() => Promise.resolve(null)),
    deleteMany: mock(() => Promise.resolve({})),
  },
};

// Mock the prisma import
mock.module('../lib', () => ({
  prisma: mockPrisma,
}));

// Mock bcrypt import
mock.module('bcryptjs', () => mockBcrypt);

describe('AuthController', () => {
  let app: Hono;

  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();

    // Create test app
    app = new Hono();
    app.post('/register', register);
    app.post('/login', login);
  });

  afterEach(() => {
    // Clean up mocks after each test
    mock.restore();
  });

  describe('register', () => {
    it('should register user successfully', async () => {
      // Mock that user doesn't exist
      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Mock successful user creation
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        username: 'test@example.com',
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const response = await app.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe('User registered successfully');
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
    });

    it('should fail with missing email', async () => {
      const response = await app.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'password123',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email and password are required');
    });

    it('should fail with missing password', async () => {
      const response = await app.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email and password are required');
    });

    it('should fail with invalid email format', async () => {
      const response = await app.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'invalid-email',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email format');
    });

    it('should fail with short password', async () => {
      const response = await app.request('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: '123',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Password must be at least 6 characters long');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      // Mock user exists with correct password hash
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        username: 'test@example.com',
        password: '$2b$10$test.hash', // Mock bcrypt hash
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      // Mock bcrypt.compare to return true for correct password
      mockBcrypt.compare.mockResolvedValue(true);

      // Mock session creation
      mockPrisma.session.create.mockResolvedValue({
        id: '1',
        userId: '1',
        token: 'test-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userAgent: 'Test Browser',
        ipAddress: '192.168.1.1',
        isActive: true,
        createdAt: new Date(),
      } as never);

      const response = await app.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Test Browser',
          'X-Forwarded-For': '192.168.1.1',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message).toBe('Login successful');
      expect(data.user).toBeDefined();
      expect(data.user.email).toBe('test@example.com');
      expect(data.session).toBeDefined();
      expect(data.session.token).toBeDefined();
      expect(data.session.expiresAt).toBeDefined();
    });

    it('should fail with missing email', async () => {
      const response = await app.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'password123',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email and password are required');
    });

    it('should fail with missing password', async () => {
      const response = await app.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Email and password are required');
    });

    it('should fail with incorrect password', async () => {
      // Mock user exists but password won't match
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: 'test@example.com',
        username: 'test@example.com',
        password: '$2b$10$test.hash', // Different hash
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      // Mock bcrypt.compare to return false for wrong password
      mockBcrypt.compare.mockResolvedValue(false);

      const response = await app.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });

    it('should fail with non-existent user', async () => {
      // Mock user doesn't exist
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const response = await app.request('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid email or password');
    });
  });
});
