import express, { Request, Response } from 'express';
import logger from './utils/logger';
import httpLoggers from './utils/logger/httpLogger';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectDB } from './configs/db';
import { errorHandler } from './middlewares/errorHandler.js';
import './config/firebaseAdmin.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(errorHandler);

httpLoggers.forEach((middleware) => app.use(middleware));

connectDB();

// Example route
app.get('/', (_req: Request, res: Response) => {
  logger.info('Accessed root route');
  res.send('Hello from TypeScript logger setup!');
});

// Error route
app.get('/error', (_req: Request, res: Response) => {
  logger.error('Simulated error occurred!');
  res.status(500).send('Simulated error!');
});


app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
