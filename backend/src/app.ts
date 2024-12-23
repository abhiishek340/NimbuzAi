import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { contentRouter } from './routes/content';
import { analyticsRouter } from './routes/analytics';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/analytics', analyticsRouter);

export default app; 