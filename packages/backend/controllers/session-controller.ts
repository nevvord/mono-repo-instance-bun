import {
  getUserSessions,
  terminateSession,
  terminateAllSessions,
  getSessionInfo,
} from '../services/session-service';
import { createLogger } from '@mono-repo/core/utils';
import { Context } from 'hono';

const logger = createLogger('SessionController');

type AuthenticatedContext = Context<{
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
}>;

export const getSessions = async (c: AuthenticatedContext) => {
  try {
    logger.info('Getting user sessions', { userId: c.var.user.id });

    const sessions = await getUserSessions(c.var.user.id);

    // Remove sensitive data from response
    const safeSessions = sessions.map(session => ({
      id: session.id,
      expiresAt: session.expiresAt,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isActive: session.isActive,
      createdAt: session.createdAt,
      isCurrentSession: session.id === c.var.session.id,
    }));

    logger.success('User sessions retrieved successfully', {
      userId: c.var.user.id,
      sessionCount: sessions.length,
    });

    return c.json({
      success: true,
      sessions: safeSessions,
    });
  } catch (error) {
    logger.fail('Error getting user sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: c.var.user.id,
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

export const getSession = async (c: AuthenticatedContext) => {
  try {
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

    logger.info('Getting session info', { userId: c.var.user.id, sessionId });

    const session = await getSessionInfo(c.var.user.id, sessionId);

    if (!session) {
      logger.warn('Session not found', { userId: c.var.user.id, sessionId });
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
      id: session.id,
      expiresAt: session.expiresAt,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isActive: session.isActive,
      createdAt: session.createdAt,
      isCurrentSession: session.id === c.var.session.id,
    };

    logger.success('Session info retrieved successfully', {
      userId: c.var.user.id,
      sessionId,
    });

    return c.json({
      success: true,
      session: safeSession,
    });
  } catch (error) {
    logger.fail('Error getting session info', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: c.var.user.id,
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

export const terminateSessionById = async (c: AuthenticatedContext) => {
  try {
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

    logger.info('Terminating session', { userId: c.var.user.id, sessionId });

    const success = await terminateSession(c.var.user.id, sessionId);

    if (!success) {
      logger.warn('Session not found or cannot be terminated', {
        userId: c.var.user.id,
        sessionId,
      });
      return c.json(
        {
          success: false,
          error: 'Session not found or cannot be terminated',
        },
        404
      );
    }

    // If terminating current session, clear cookie
    if (sessionId === c.var.session.id) {
      c.header(
        'Set-Cookie',
        'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
      );
    }

    logger.success('Session terminated successfully', {
      userId: c.var.user.id,
      sessionId,
    });

    return c.json({
      success: true,
      message: 'Session terminated successfully',
    });
  } catch (error) {
    logger.fail('Error terminating session', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: c.var.user.id,
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

export const terminateAllUserSessions = async (c: AuthenticatedContext) => {
  try {
    logger.info('Terminating all user sessions', { userId: c.var.user.id });

    const terminatedCount = await terminateAllSessions(c.var.user.id);

    // Clear current session cookie
    c.header(
      'Set-Cookie',
      'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    );

    logger.success('All user sessions terminated successfully', {
      userId: c.var.user.id,
      terminatedCount,
    });

    return c.json({
      success: true,
      message: 'All sessions terminated successfully',
      terminatedCount,
    });
  } catch (error) {
    logger.fail('Error terminating all sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: c.var.user.id,
    });
    return c.json(
      {
        success: false,
        error: 'Failed to terminate all sessions',
      },
      500
    );
  }
};

export const logout = async (c: AuthenticatedContext) => {
  try {
    logger.info('User logout', {
      userId: c.var.user.id,
      sessionId: c.var.session.id,
    });

    // Terminate current session
    await terminateSession(c.var.user.id, c.var.session.id);

    // Clear session cookie
    c.header(
      'Set-Cookie',
      'session_token=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
    );

    logger.success('User logged out successfully', {
      userId: c.var.user.id,
      sessionId: c.var.session.id,
    });

    return c.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logger.fail('Error during logout', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: c.var.user.id,
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
