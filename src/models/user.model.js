import db from '../../db/db.js';

export const findAll = async () => {
  const { rows } = await db.query(`select * from users`);
  return rows;
};
