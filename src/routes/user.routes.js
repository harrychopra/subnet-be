import { getUsers } from '../controllers/user.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

import express from 'express';

const router = express.Router();

router.route('/').get(getUsers).all(handleMethodNotValid);

export default router;
