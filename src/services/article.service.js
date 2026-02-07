import { NotFoundError } from '../errors.js';
import {
  articleExists,
  findAll,
  findById,
  updateVotes
} from '../models/article.model.js';

export const findArticles = qParams => findAll(qParams);

export const findArticleById = async articleId => {
  const article = await findById(articleId);
  if (article === undefined) {
    throw new NotFoundError('Article id not found');
  }
  return article;
};

export const checkArticleExists = async articleId => {
  const { exists } = await articleExists(articleId);
  if (!exists) throw new NotFoundError('Article id not found');
};

export const updateArticleVotes = async payload => {
  await checkArticleExists(payload.articleId);
  return updateVotes(payload);
};
