import { NotFoundError } from '../errors.js';
import { findAll, findById, idExists } from '../models/article.model.js';

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

export const checkArticleExists = async articleId => {
  const { exists } = await idExists(articleId);
  if (!exists) throw new NotFoundError('Article id not found');
};
