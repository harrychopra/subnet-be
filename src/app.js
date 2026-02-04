import express from 'express';
import { topicRouter } from './routes/index.js';

const app = express();

app.use('/api/topics', topicRouter);

export default app;
