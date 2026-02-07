import { findAllByArticleId, insert } from '../models/comment.model.js';
import { checkArticleExists } from './article.service.js';

export const findCommentsByArticleId = async articleId => {
  await checkArticleExists(articleId);
  return findAllByArticleId(articleId);
};

export const createComment = async comment => {
  await checkArticleExists(comment.articleId);
  return insert(comment);
};
