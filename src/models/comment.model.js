import format from 'pg-format';
import db from '../../db/db.js';

export const findAllByArticleId = async articleId => {
  const { rows } = await db.query(
    `--sql
        select *
        from comments
        where article_id = $1
        order by created_at desc`,
    [articleId]
  );
  return rows;
};

export const insert = async comment => {
  const { articleId, body, author } = comment;
  const query = format(
    `insert into comments (
      article_id, author, body
    ) VALUES (%L) returning *`,
    [articleId, author, body]
  );
  const { rows } = await db.query(query);
  return rows[0];
};

export const commentExists = async commentId => {
  const { rows } = await db.query(
    `--sql
    select exists(
        select 1 from comments
        where comment_id = $1
    )`,
    [commentId]
  );
  return rows[0];
};

export const deleteById = async commentId => {
  const result = await db.query(
    `--sql
      delete from comments
      where comment_id = $1`,
    [commentId]
  );
  return result.rowCount;
};
