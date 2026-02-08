import { findUser, findUsers } from '../services/user.service.js';

export const getUsers = async (req, res) => {
  const users = await findUsers();
  return res.status(200).json({ users });
};

export const getUser = async (req, res) => {
  const { username } = req.params;
  const user = await findUser(username);
  res.status(200).json({ user });
};
