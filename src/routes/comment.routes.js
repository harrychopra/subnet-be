import {
  deleteComment,
  updateCommentVotes
} from '../controllers/comment.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

import express from 'express';

const router = express.Router();

router.route('/:commentId')
  .delete(deleteComment)
  .patch(updateCommentVotes)
  .all(handleMethodNotValid);

export default router;
