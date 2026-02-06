import { ValidationError } from '../errors.js';
import { findCommentsByArticleId } from '../services/comment.service.js';

export const getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;

  const id = parseInt(articleId, 10);

  if (isNaN(id) || id < 1) {
    throw new ValidationError('Invalid article id/ format');
  }

  const comments = await findCommentsByArticleId(articleId);
  return res.status(200).json({ comments });
};
