import { findUsers } from '../services/user.service.js';

export const getUsers = async (req, res) => {
  const users = await findUsers();
  return res.status(200).json({ users });
};
