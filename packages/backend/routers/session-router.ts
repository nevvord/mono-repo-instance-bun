import { Hono } from 'hono';
import {
  authenticateUser,
  AuthenticatedContext,
} from '../middleware/auth-middleware';
import {
  getSessions,
  getSession,
  terminateSessionById,
  terminateAllUserSessions,
  logout,
} from '../controllers/session-controller';

// Create a typed router that knows about AuthenticatedContext
const sessionRouter = new Hono<{
  Variables: {
    user: AuthenticatedContext['user'];
    session: AuthenticatedContext['session'];
  };
}>();

// Apply authentication middleware to all routes
sessionRouter.use('*', authenticateUser);

// Get all user sessions
sessionRouter.get('/', getSessions);

// Get specific session info
sessionRouter.get('/:sessionId', getSession);

// Terminate specific session
sessionRouter.delete('/:sessionId', terminateSessionById);

// Terminate all user sessions
sessionRouter.delete('/', terminateAllUserSessions);

// Logout (terminate current session)
sessionRouter.post('/logout', logout);

export { sessionRouter };
