import { findAllByArticleId } from '../models/comment.model.js';
import { checkArticleExists } from './article.service.js';

export const findCommentsByArticleId = async articleId => {
  await checkArticleExists(articleId);
  return findAllByArticleId(articleId);
};
