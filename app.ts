import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mainRouter from './components/index';
import { apiLogger } from './tools/logger/api.logger';
import { limiter } from './tools/limiter/rate.limit';

const app: Application = express();

// Limiter
app.use(limiter);

// Config helmet to help secure express
app.use(helmet());

// Config cors
app.use(cors());

app.use(express.json());
app.use(apiLogger);
app.use(mainRouter);

export default app;
