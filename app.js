import express from 'express';
import router from './route/topic.route.js';

const app = express();

app.use('/api/topics', router);

export default app;
