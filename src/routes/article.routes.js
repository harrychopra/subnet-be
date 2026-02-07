import express from 'express';
import {
  getArticle,
  getArticles,
  updateArticleVotes
} from '../controllers/article.controller.js';
import {
  addComment,
  getCommentsByArticle
} from '../controllers/comment.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

const router = express.Router();

router.route('/')
  .get(getArticles)
  .all(handleMethodNotValid);

router.route('/:articleId')
  .get(getArticle)
  .patch(updateArticleVotes)
  .all(handleMethodNotValid);

router.route('/:articleId/comments')
  .get(getCommentsByArticle)
  .post(addComment)
  .all(handleMethodNotValid);

export default router;
