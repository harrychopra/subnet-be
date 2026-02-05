import { findArticles } from '../services/article.service.js';

export const getArticles = async (_, res) => {
  const articles = await findArticles();

  res.status(200).json({ articles });
};
