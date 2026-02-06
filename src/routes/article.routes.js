import express from 'express';
import { getArticle, getArticles } from '../controllers/article.controller.js';
import { getCommentsByArticle } from '../controllers/comment.controller.js';
import { handleMethodNotValid } from '../middleware/error.middleware.js';

const router = express.Router();

router.route('/').get(getArticles).all(handleMethodNotValid);
router.route('/:articleId').get(getArticle).all(handleMethodNotValid);
router.route('/:articleId/comments').get(getCommentsByArticle).all(
  handleMethodNotValid
);

export default router;
