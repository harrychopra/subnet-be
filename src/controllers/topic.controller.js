import { findTopics } from '../services/topic.service.js';

export const getTopics = async (req, res) => {
  const topics = await findTopics();
  res.status(200).json({ topics });
};
