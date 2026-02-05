import express from 'express';
import { getTopics } from '../controllers/topic.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

const router = express.Router();

router.route('/').get(getTopics).all(handleMethodNotValid);

export default router;
