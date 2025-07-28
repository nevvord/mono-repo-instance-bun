import { Hono } from 'hono';
import { getHealth } from '../controllers/health-controller';

const healthRouter = new Hono();

healthRouter.get('/health', getHealth);

export { healthRouter };
