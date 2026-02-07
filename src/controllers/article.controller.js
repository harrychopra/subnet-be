import { ValidationError } from '../errors.js';
import { updateArticleVotesSchema } from '../schemas/article.schema.js';
import {
  findArticleById,
  findArticles,
  updateArticleVotes as updateArticleVotesService
} from '../services/article.service.js';
import { formatZodErrors, isValidId } from './utils/helper.js';

export const getArticles = async (_, res) => {
  const articles = await findArticles();

  res.status(200).json({ articles });
};

export const getArticle = async (req, res) => {
  const { articleId } = req.params;

  if (!isValidId(articleId)) {
    throw new ValidationError('Invalid article id/ format');
  }

  const article = await findArticleById(articleId);
  res.status(200).json({ article });
};

export const updateArticleVotes = async (req, res) => {
  const { articleId } = req.params;

  if (!isValidId(articleId)) {
    throw new ValidationError('Invalid article id/ format');
  }

  const result = updateArticleVotesSchema.safeParse(req.body);
  if (!result.success) {
    const message = formatZodErrors(result);
    throw new ValidationError(message);
  }

  const payload = { ...result.data, articleId };

  const article = await updateArticleVotesService(payload);
  res.status(200).json({ article });
};
