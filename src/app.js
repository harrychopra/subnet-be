import express from 'express';
import { handleError, handleNotFound } from './middleware/error.middleware.js';
import { topicRouter } from './routes/index.js';

const app = express();

app.use('/api/topics', topicRouter);

app.use(handleNotFound);
app.use(handleError);

export default app;
