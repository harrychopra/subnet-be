import { ValidationError } from '../errors.js';
import { addCommentSchema } from '../schemas/comment.schema.js';
import { updateVotesSchema } from '../schemas/common.schema.js';
import {
  createComment,
  findCommentsByArticleId,
  removeComment,
  updateCommentVotes as updateCommentVotesService
} from '../services/comment.service.js';
import { formatZodErrors, isValidId } from './utils/helper.js';

export const getCommentsByArticle = async (req, res) => {
  const { articleId } = req.params;

  if (!isValidId(articleId)) {
    throw new ValidationError('Invalid article id/ format');
  }

  const comments = await findCommentsByArticleId(articleId);
  return res.status(200).json({ comments });
};

export const addComment = async (req, res) => {
  const { articleId } = req.params;

  if (!isValidId(articleId)) {
    throw new ValidationError('Invalid article id/ format');
  }

  const { data, success, error } = addCommentSchema.safeParse(req.body);
  if (!success) {
    const message = formatZodErrors(error);
    throw new ValidationError(message);
  }

  data.articleId = articleId;

  const comment = await createComment(data);
  res.status(201).json({ comment });
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  if (!isValidId(commentId)) {
    throw new ValidationError('Invalid comment id/ format');
  }

  const hasRemoved = await removeComment(commentId);
  if (!hasRemoved) {
    throw new Error(`Failed to delete comment id ${commentId}`);
  }

  res.status(204).send();
};

export const updateCommentVotes = async (req, res) => {
  const { commentId } = req.params;
  if (!isValidId(commentId)) {
    throw new ValidationError('Invalid comment id/ format');
  }

  const { data, success, error } = updateVotesSchema.safeParse(req.body);
  if (!success) {
    const message = formatZodErrors(error);
    throw new ValidationError(message);
  }

  data.commentId = commentId;
  const comment = await updateCommentVotesService(data);
  res.status(200).json({ comment });
};
