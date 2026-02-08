import db from '../../db/db.js';

export const findAll = async () => {
  const { rows } = await db.query(`select * from users`);
  return rows;
};

export const FindByUsername = async username => {
  const { rows } = await db.query(
    `select * from users where username = $1`,
    [username]
  );
  return rows[0];
};
