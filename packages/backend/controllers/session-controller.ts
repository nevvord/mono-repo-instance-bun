import {
  getUserSessions,
  terminateSession,
  terminateAllSessions,
  getSessionInfo,
} from '../services/session-service';
import { createLogger } from '@mono-repo/core/utils';
import { Context } from 'hono';

const logger = createLogger('SessionController');

export const getSessions = async (
  c: Context<{
    Variables: {
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
    };
  }>
) => {
  try {
    const user = c.var.user;
    const session = c.var.session;

    logger.info('Getting user sessions', { userId: user.id });

    const sessions = await getUserSessions(user.id);

    // Remove sensitive data from response
    const safeSessions = sessions.map(sessionItem => ({
      id: sessionItem.id,
      expiresAt: sessionItem.expiresAt,
      userAgent: sessionItem.userAgent,
      ipAddress: sessionItem.ipAddress,
      isActive: sessionItem.isActive,
      createdAt: sessionItem.createdAt,
      isCurrentSession: sessionItem.id === session.id,
    }));

    logger.success('User sessions retrieved successfully', {
      userId: user.id,
      sessionCount: sessions.length,
    });

    return c.json({
      success: true,
      sessions: safeSessions,
    });
  } catch (error) {
    const user = c.var.user;
    logger.fail('Error getting user sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to get sessions',
      },
      500
    );
  }
};

export const getSession = async (
  c: Context<{
    Variables: {
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
    };
  }>
) => {
  try {
    const user = c.var.user;
    const session = c.var.session;
    const sessionId = c.req.param('sessionId');

    if (!sessionId) {
      logger.warn('Session ID not provided');
      return c.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        400
      );
    }

    logger.info('Getting session info', { userId: user.id, sessionId });

    const sessionInfo = await getSessionInfo(user.id, sessionId);

    if (!sessionInfo) {
      logger.warn('Session not found', { userId: user.id, sessionId });
      return c.json(
        {
          success: false,
          error: 'Session not found',
        },
        404
      );
    }

    // Remove sensitive data from response
    const safeSession = {
      id: sessionInfo.id,
      expiresAt: sessionInfo.expiresAt,
      userAgent: sessionInfo.userAgent,
      ipAddress: sessionInfo.ipAddress,
      isActive: sessionInfo.isActive,
      createdAt: sessionInfo.createdAt,
      isCurrentSession: sessionInfo.id === session.id,
    };

    logger.success('Session info retrieved successfully', {
      userId: user.id,
      sessionId,
    });

    return c.json({
      success: true,
      session: safeSession,
    });
  } catch (error) {
    const user = c.var.user;
    logger.fail('Error getting session info', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to get session info',
      },
      500
    );
  }
};

export const terminateSessionById = async (
  c: Context<{
    Variables: {
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
    };
  }>
) => {
  try {
    const user = c.var.user;
    const session = c.var.session;
    const sessionId = c.req.param('sessionId');

    if (!sessionId) {
      logger.warn('Session ID not provided');
      return c.json(
        {
          success: false,
          error: 'Session ID is required',
        },
        400
      );
    }

    // Prevent terminating current session through this endpoint
    if (sessionId === session.id) {
      logger.warn('Attempt to terminate current session', {
        userId: user.id,
        sessionId,
      });
      return c.json(
        {
          success: false,
          error:
            'Cannot terminate current session. Use logout endpoint instead.',
        },
        400
      );
    }

    logger.info('Terminating session', { userId: user.id, sessionId });

    const terminated = await terminateSession(user.id, sessionId);

    if (!terminated) {
      logger.warn('Session not found or already terminated', {
        userId: user.id,
        sessionId,
      });
      return c.json(
        {
          success: false,
          error: 'Session not found or already terminated',
        },
        404
      );
    }

    logger.success('Session terminated successfully', {
      userId: user.id,
      sessionId,
    });

    return c.json({
      success: true,
      message: 'Session terminated successfully',
    });
  } catch (error) {
    const user = c.var.user;
    logger.fail('Error terminating session', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to terminate session',
      },
      500
    );
  }
};

export const terminateAllUserSessions = async (
  c: Context<{
    Variables: {
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
    };
  }>
) => {
  try {
    const user = c.var.user;

    logger.info('Terminating all user sessions', { userId: user.id });

    const terminatedCount = await terminateAllSessions(user.id);

    logger.success('All user sessions terminated successfully', {
      userId: user.id,
      terminatedCount,
    });

    return c.json({
      success: true,
      message: 'All sessions terminated successfully',
      terminatedCount,
    });
  } catch (error) {
    const user = c.var.user;
    logger.fail('Error terminating all sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to terminate sessions',
      },
      500
    );
  }
};

export const logout = async (
  c: Context<{
    Variables: {
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
    };
  }>
) => {
  try {
    const user = c.var.user;
    const session = c.var.session;

    logger.info('User logging out', { userId: user.id, sessionId: session.id });

    // Terminate current session
    await terminateSession(user.id, session.id);

    // Clear session cookie
    c.header(
      'Set-Cookie',
      'session_token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict'
    );

    logger.success('User logged out successfully', {
      userId: user.id,
      sessionId: session.id,
    });

    return c.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    const user = c.var.user;
    logger.fail('Error during logout', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to logout',
      },
      500
    );
  }
};
