import express from 'express';
import logger from './utils/logger';
import httpLoggers from './utils/logger/httpLogger';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './configs/db';
import { errorHandler } from './middlewares/errorHandler';
import './configs/firebaseAdmin';
import router from './routes';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(errorHandler);

httpLoggers.forEach((middleware) => app.use(middleware));

app.use('/api', router);

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
