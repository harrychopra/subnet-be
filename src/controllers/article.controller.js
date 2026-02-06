import { ValidationError } from '../errors.js';
import {
  findArticleById,
  findArticles
} from '../services/article.service.js';
import { isValidId } from './utils/helper.js';

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
  res.json({ article });
};
