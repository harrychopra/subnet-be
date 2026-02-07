import { deleteComment } from '../controllers/comment.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

import express from 'express';

const router = express.Router();

router.route('/:commentId')
  .delete(deleteComment)
  .all(handleMethodNotValid);

export default router;
