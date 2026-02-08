import { NotFoundError } from '../errors.js';
import { findAll, FindByUsername } from '../models/user.model.js';

export const findUsers = () => findAll();

export const findUser = async username => {
  const user = await FindByUsername(username);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return user;
};
