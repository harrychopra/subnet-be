import { ValidationError } from '../errors.js';
import { findCommentsByArticleId } from '../services/comment.service.js';
import { isValidId } from './utils/helper.js';

export const getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;

  if (!isValidId(articleId)) {
    throw new ValidationError('Invalid article id/ format');
  }

  const comments = await findCommentsByArticleId(articleId);
  return res.status(200).json({ comments });
};
