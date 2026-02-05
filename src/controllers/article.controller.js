import { ValidationError } from '../errors.js';
import {
  findArticleById,
  findArticles
} from '../services/article.service.js';

export const getArticles = async (_, res) => {
  const articles = await findArticles();

  res.status(200).json({ articles });
};

export const getArticle = async (req, res) => {
  const { articleId } = req.params;

  const id = parseInt(articleId, 10);

  if (isNaN(id) || id < 1) {
    throw new ValidationError('Invalid article id/ format');
  }

  const article = await findArticleById(articleId);
  res.json({ article });
};
