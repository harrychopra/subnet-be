import express from 'express';
import { handleError, handleNotFound } from './middleware/error.middleware.js';
import { articleRouter, topicRouter, userRouter } from './routes/index.js';

const app = express();

app.use(express.json());

app.use('/api/topics', topicRouter);
app.use('/api/users', userRouter);
app.use('/api/articles', articleRouter);

app.use(handleNotFound);
app.use(handleError);

export default app;
