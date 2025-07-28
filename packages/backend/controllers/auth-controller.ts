import { Context } from 'hono';
import { registerUser, loginUser } from '../services/user-service';
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('AuthController');

export const register = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    logger.info('Registration request received', { email });

    // Validate input
    if (!email || !password) {
      logger.warn('Registration failed: missing required fields', {
        email: !!email,
        password: !!password,
      });
      return c.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        400
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn('Registration failed: invalid email format', { email });
      return c.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        400
      );
    }

    // Basic password validation
    if (password.length < 6) {
      logger.warn('Registration failed: password too short', {
        email,
        passwordLength: password.length,
      });
      return c.json(
        {
          success: false,
          error: 'Password must be at least 6 characters long',
        },
        400
      );
    }

    // Register user
    const result = await registerUser({ email, password });

    if (!result.success) {
      logger.warn('Registration failed', { email, error: result.error });
      return c.json(
        {
          success: false,
          error: result.error,
        },
        400
      );
    }

    logger.success('Registration completed successfully', {
      email,
      userId: result.user?.id,
    });
    return c.json(
      {
        success: true,
        message: 'User registered successfully',
        user: result.user,
      },
      201
    );
  } catch (error) {
    logger.fail('Registration error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return c.json(
      {
        success: false,
        error: 'Internal server error',
      },
      500
    );
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    logger.info('Login request received', { email });

    // Validate input
    if (!email || !password) {
      logger.warn('Login failed: missing required fields', {
        email: !!email,
        password: !!password,
      });
      return c.json(
        {
          success: false,
          error: 'Email and password are required',
        },
        400
      );
    }

    // Get user agent and IP address
    const userAgent = c.req.header('User-Agent');
    const ipAddress =
      c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown';

    // Login user
    const result = await loginUser({
      email,
      password,
      userAgent,
      ipAddress,
    });

    if (!result.success) {
      logger.warn('Login failed', { email, error: result.error });
      return c.json(
        {
          success: false,
          error: result.error,
        },
        401
      );
    }

    // Set HTTP-only cookie with session token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict' as const,
      maxAge: 24 * 60 * 60, // 24 hours in seconds
      path: '/',
    };

    c.header(
      'Set-Cookie',
      `session_token=${result.session?.token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => {
          if (key === 'maxAge') return `Max-Age=${value}`;
          if (key === 'sameSite') return `SameSite=${value}`;
          return `${key.charAt(0).toUpperCase() + key.slice(1)}=${value}`;
        })
        .join('; ')}`
    );

    logger.success('Login completed successfully', {
      email,
      userId: result.user?.id,
    });
    return c.json(
      {
        success: true,
        message: 'Login successful',
        user: result.user,
        session: {
          expiresAt: result.session?.expiresAt,
        },
      },
      200
    );
  } catch (error) {
    logger.fail('Login error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return c.json(
      {
        success: false,
        error: 'Internal server error',
      },
      500
    );
  }
};
