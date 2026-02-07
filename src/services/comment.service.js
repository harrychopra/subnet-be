import { NotFoundError } from '../errors.js';
import {
  commentExists,
  deleteById,
  findAllByArticleId,
  insert
} from '../models/comment.model.js';
import { checkArticleExists } from './article.service.js';

export const findCommentsByArticleId = async articleId => {
  await checkArticleExists(articleId);
  return findAllByArticleId(articleId);
};

export const createComment = async comment => {
  await checkArticleExists(comment.articleId);
  return insert(comment);
};

export const checkCommentExists = async commentId => {
  const { exists } = await commentExists(commentId);
  if (!exists) throw new NotFoundError('Comment id not found');
};

export const removeComment = async commentId => {
  await checkCommentExists(commentId);
  const rowAffected = await deleteById(commentId);
  return rowAffected === 1;
};
