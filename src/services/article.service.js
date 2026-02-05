import { findAll } from '../models/article.model.js';

export const findArticles = () => {
  return findAll();
};
