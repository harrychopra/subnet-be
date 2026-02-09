import { ValidationError } from '../errors.js';
import {
  articleSortByQuerySchema
} from '../schemas/article.schema.js';
import { updateVotesSchema } from '../schemas/common.schema.js';
import {
  findArticleById,
  findArticles,
  updateArticleVotes as updateArticleVotesService
} from '../services/article.service.js';
import { formatZodErrors, isValidId } from './utils/helper.js';

export const getArticles = async (req, res) => {
  const { data: qParams, success, error } = articleSortByQuerySchema
    .safeParse(req.query);

  if (!success) {
    const message = formatZodErrors(error);
    throw new ValidationError(message);
  }

  const articles = await findArticles(qParams);
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

  const { data, success, error } = updateVotesSchema.safeParse(req.body);
  if (!success) {
    const message = formatZodErrors(error);
    throw new ValidationError(message);
  }

  data.articleId = articleId;

  const article = await updateArticleVotesService(data);
  res.status(200).json({ article });
};
