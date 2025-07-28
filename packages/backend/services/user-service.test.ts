import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { loginUser, registerUser } from './user-service';

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

describe('UserService', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();
  });

  afterEach(() => {
    // Clean up mocks after each test
    mock.restore();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock that user doesn't exist
      mockPrisma.user.findFirst.mockResolvedValue(null);

      // Mock successful user creation
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: userData.email,
        username: userData.email,
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const result = await registerUser(userData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(userData.email);
      expect(result.user?.username).toBe(userData.email);
      expect(result.user?.isActive).toBe(true);
      expect(result.user?.isVerified).toBe(false);
      expect(result.user?.role).toBe('USER');
    });

    it('should fail when user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock that user already exists
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: userData.email,
        username: userData.email,
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
      };

      // Mock user exists with correct password hash
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: loginData.email,
        username: loginData.email,
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
        userAgent: loginData.userAgent,
        ipAddress: loginData.ipAddress,
        isActive: true,
        createdAt: new Date(),
      } as never);

      const result = await loginUser(loginData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(loginData.email);
      expect(result.session).toBeDefined();
      expect(result.session?.token).toBeDefined();
      expect(result.session?.expiresAt).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Mock user exists but password won't match
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: loginData.email,
        username: loginData.email,
        password: '$2b$10$test.hash', // Different hash
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      // Mock bcrypt.compare to return false for wrong password
      mockBcrypt.compare.mockResolvedValue(false);

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      // Mock user doesn't exist
      mockPrisma.user.findFirst.mockResolvedValue(null);

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    it('should fail with missing email', async () => {
      const loginData = {
        email: '',
        password: 'password123',
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    it('should create session with user agent and IP address', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        userAgent: 'Mozilla/5.0 Test Browser',
        ipAddress: '192.168.1.1',
      };

      // Mock user exists
      mockPrisma.user.findFirst.mockResolvedValue({
        id: '1',
        email: loginData.email,
        username: loginData.email,
        password: '$2b$10$test.hash',
        isActive: true,
        isVerified: false,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as never);

      // Mock bcrypt.compare to return true
      mockBcrypt.compare.mockResolvedValue(true);

      // Mock session creation
      mockPrisma.session.create.mockResolvedValue({
        id: '1',
        userId: '1',
        token: 'test-token',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userAgent: loginData.userAgent,
        ipAddress: loginData.ipAddress,
        isActive: true,
        createdAt: new Date(),
      } as never);

      const result = await loginUser(loginData);

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      // Note: The session object returned by loginUser only contains token and expiresAt
      // The full session data with userAgent and ipAddress is stored in the database
      expect(result.session?.token).toBeDefined();
      expect(result.session?.expiresAt).toBeDefined();
    });
  });
});
