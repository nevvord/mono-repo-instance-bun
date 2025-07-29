import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { loginUser, registerUser } from './user-service';
import { prisma } from '../lib';

describe('UserService', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterEach(async () => {
    // Clean up database after each test
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };

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

      // Register user first time
      await registerUser(userData);

      // Try to register same user again
      const result = await registerUser(userData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User with this email already exists');
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with correct credentials', async () => {
      // First register a user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // Then try to login
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe(userData.email);
      expect(result.session).toBeDefined();
      expect(result.session?.token).toBeDefined();
      expect(result.session?.expiresAt).toBeDefined();
    });

    it('should fail with incorrect password', async () => {
      // First register a user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // Try to login with wrong password
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

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
      // First register a user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
      };
      await registerUser(userData);

      // Login with user agent and IP
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
        userAgent: 'Mozilla/5.0 Test Browser',
        ipAddress: '192.168.1.1',
      };

      const result = await loginUser(loginData);

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();

      // Verify session was created in database
      const session = await prisma.session.findFirst({
        where: { token: result.session?.token },
      });

      expect(session).toBeDefined();
      expect(session?.userAgent).toBe(loginData.userAgent);
      expect(session?.ipAddress).toBe(loginData.ipAddress);
      expect(session?.isActive).toBe(true);
    });
  });
});
