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
