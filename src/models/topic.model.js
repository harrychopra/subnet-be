import db from '../../db/db.js';

export const findAll = async () => {
  const { rows } = await db.query(`select slug, description from topics`);
  return rows;
};
