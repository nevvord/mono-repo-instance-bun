import { Hono } from 'hono';
import { register, login } from '../controllers/auth-controller';

const authRouter = new Hono();

// Register route
authRouter.post('/register', register);

// Login route
authRouter.post('/login', login);

export { authRouter };
