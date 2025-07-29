import { Context, Next } from 'hono';
import { prisma } from '../lib';
import { createLogger } from '@mono-repo/core/utils';
import { randomBytes } from 'crypto';

const logger = createLogger('AuthMiddleware');

export interface AuthenticatedContext extends Context {
  user: {
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    isVerified: boolean;
    role: string;
  };
  session: {
    id: string;
    token: string;
    expiresAt: Date;
  };
}

export const authenticateUser = async (c: Context, next: Next) => {
  try {
    // Get session token from cookie
    const sessionToken = c.req
      .header('Cookie')
      ?.match(/session_token=([^;]+)/)?.[1];

    if (!sessionToken) {
      logger.warn('Authentication failed: no session token in cookie');
      return c.json(
        {
          success: false,
          error: 'Authentication required',
        },
        401
      );
    }

    // Find active session
    const session = await prisma.session.findFirst({
      where: {
        token: sessionToken,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            isActive: true,
            isVerified: true,
            role: true,
          },
        },
      },
    });

    if (!session) {
      logger.warn('Authentication failed: invalid or expired session token');
      return c.json(
        {
          success: false,
          error: 'Invalid or expired session',
        },
        401
      );
    }

    if (!session.user.isActive) {
      logger.warn('Authentication failed: user account is inactive', {
        userId: session.user.id,
      });
      return c.json(
        {
          success: false,
          error: 'Account is deactivated',
        },
        401
      );
    }

    // Check if session needs refresh (expires in less than 1 hour)
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    const needsRefresh = session.expiresAt < oneHourFromNow;

    if (needsRefresh) {
      logger.info('Refreshing session token', {
        userId: session.user.id,
        sessionId: session.id,
      });

      // Generate new token
      const newToken = randomBytes(32).toString('hex');
      const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Update session in database
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: newToken,
          expiresAt: newExpiresAt,
        },
      });

      // Set new cookie
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 24 * 60 * 60,
        path: '/',
      };

      c.header(
        'Set-Cookie',
        `session_token=${newToken}; ${Object.entries(cookieOptions)
          .map(([key, value]) => {
            if (key === 'maxAge') return `Max-Age=${value}`;
            if (key === 'sameSite') return `SameSite=${value}`;
            return `${key.charAt(0).toUpperCase() + key.slice(1)}=${value}`;
          })
          .join('; ')}`
      );

      // Update session object for context
      session.token = newToken;
      session.expiresAt = newExpiresAt;
    }

    // Add user and session to context
    (c as AuthenticatedContext).user = session.user;
    (c as AuthenticatedContext).session = {
      id: session.id,
      token: session.token,
      expiresAt: session.expiresAt,
    };

    logger.info('User authenticated successfully', {
      userId: session.user.id,
      email: session.user.email,
      sessionId: session.id,
    });

    await next();
  } catch (error) {
    logger.fail('Authentication middleware error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return c.json(
      {
        success: false,
        error: 'Authentication error',
      },
      500
    );
  }
};

export const requireRole = (requiredRole: string) => {
  return async (c: AuthenticatedContext, next: Next) => {
    if (c.user.role !== requiredRole && c.user.role !== 'ADMIN') {
      logger.warn('Access denied: insufficient role', {
        userId: c.user.id,
        userRole: c.user.role,
        requiredRole,
      });
      return c.json(
        {
          success: false,
          error: 'Insufficient permissions',
        },
        403
      );
    }

    await next();
  };
};
