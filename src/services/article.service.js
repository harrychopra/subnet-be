import { NotFoundError } from '../errors.js';
import { findAll, findById } from '../models/article.model.js';

export const findArticles = () => {
  return findAll();
};

export const findArticleById = async articleId => {
  const article = await findById(articleId);
  if (article === undefined) {
    throw new NotFoundError('Article id not found');
  }
  return article;
};
