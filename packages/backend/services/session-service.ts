import { prisma } from '../lib';
import { createLogger } from '@mono-repo/core/utils';

const logger = createLogger('SessionService');

export interface SessionInfo {
  id: string;
  token: string;
  expiresAt: Date;
  userAgent: string | null;
  ipAddress: string | null;
  isActive: boolean;
  createdAt: Date;
}

export const getUserSessions = async (
  userId: string
): Promise<SessionInfo[]> => {
  try {
    logger.info('Getting user sessions', { userId });

    const sessions = await prisma.session.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        userAgent: true,
        ipAddress: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    logger.success('User sessions retrieved successfully', {
      userId,
      sessionCount: sessions.length,
    });

    return sessions;
  } catch (error) {
    logger.fail('Error getting user sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    });
    throw new Error('Failed to get user sessions');
  }
};

export const terminateSession = async (
  userId: string,
  sessionId: string
): Promise<boolean> => {
  try {
    logger.info('Terminating user session', { userId, sessionId });

    // Verify session belongs to user
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        isActive: true,
      },
    });

    if (!session) {
      logger.warn('Session not found or does not belong to user', {
        userId,
        sessionId,
      });
      return false;
    }

    // Deactivate session
    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    logger.success('Session terminated successfully', {
      userId,
      sessionId,
    });

    return true;
  } catch (error) {
    logger.fail('Error terminating session', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      sessionId,
    });
    throw new Error('Failed to terminate session');
  }
};

export const terminateAllSessions = async (userId: string): Promise<number> => {
  try {
    logger.info('Terminating all user sessions', { userId });

    const result = await prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: { isActive: false },
    });

    logger.success('All user sessions terminated successfully', {
      userId,
      terminatedCount: result.count,
    });

    return result.count;
  } catch (error) {
    logger.fail('Error terminating all sessions', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
    });
    throw new Error('Failed to terminate all sessions');
  }
};

export const getSessionInfo = async (
  userId: string,
  sessionId: string
): Promise<SessionInfo | null> => {
  try {
    logger.info('Getting session info', { userId, sessionId });

    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        token: true,
        expiresAt: true,
        userAgent: true,
        ipAddress: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!session) {
      logger.warn('Session not found or expired', { userId, sessionId });
      return null;
    }

    logger.success('Session info retrieved successfully', {
      userId,
      sessionId,
    });

    return session;
  } catch (error) {
    logger.fail('Error getting session info', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId,
      sessionId,
    });
    throw new Error('Failed to get session info');
  }
};
