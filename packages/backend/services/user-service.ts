import { prisma } from '../lib';
import bcrypt from 'bcryptjs';
import { createLogger } from '@mono-repo/core/utils';
import { randomBytes } from 'crypto';

const logger = createLogger('UserService');

export interface RegisterUserData {
  email: string;
  password: string;
}

export interface RegisterUserResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isVerified: boolean;
    role: string;
    createdAt: Date;
  };
  error?: string;
}

export interface LoginUserData {
  email: string;
  password: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface LoginUserResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isVerified: boolean;
    role: string;
    createdAt: Date;
  };
  session?: {
    token: string;
    expiresAt: Date;
  };
  error?: string;
}

export const registerUser = async (
  data: RegisterUserData
): Promise<RegisterUserResult> => {
  try {
    logger.info('Attempting to register new user', { email: data.email });

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.email }, // Using email as username for now
        ],
      },
    });

    if (existingUser) {
      logger.warn('Registration failed: user already exists', {
        email: data.email,
      });
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.email, // Using email as username for now
        password: hashedPassword,
        isActive: true,
        isVerified: false,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        isActive: true,
        isVerified: true,
        role: true,
        createdAt: true,
      },
    });

    logger.success('User registered successfully', {
      userId: user.id,
      email: user.email,
    });
    return {
      success: true,
      user,
    };
  } catch (error) {
    logger.fail('Error registering user', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      success: false,
      error: 'Failed to register user',
    };
  }
};

export const loginUser = async (
  data: LoginUserData
): Promise<LoginUserResult> => {
  try {
    logger.info('Attempting to login user', { email: data.email });

    // Find user by email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.email }],
      },
    });

    if (!user) {
      logger.warn('Login failed: user not found', { email: data.email });
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login failed: user account is inactive', {
        email: data.email,
        userId: user.id,
      });
      return {
        success: false,
        error: 'Account is deactivated',
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', {
        email: data.email,
        userId: user.id,
      });
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Generate session token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        isActive: true,
      },
    });

    logger.success('User logged in successfully', {
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isActive: user.isActive,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt,
      },
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error) {
    logger.fail('Error logging in user', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return {
      success: false,
      error: 'Failed to login user',
    };
  }
};
