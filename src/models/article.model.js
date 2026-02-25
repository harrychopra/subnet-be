import format from 'pg-format';
import db from '../../db/db.js';

export const findAll = async ({ sort_by, order, topic }) => {
  const query = `--sql
    select a.article_id, a.title, a.topic, a.author, a.votes, a.article_img_url, a.created_at,
        coalesce(c.comment_count, 0) as comment_count
    from articles as a
    left join (
        select article_id, count(*)::int as comment_count
        from comments
        group by article_id
    ) as c
    on c.article_id = a.article_id
    where (a.topic = $1 or $1 is null)
    order by ${sort_by} ${order}`;
  // Combination of str interpolation and parameterized queries
  // Safe as long as controller safe lists incoming sort_by & order

  const { rows } = await db.query(query, [topic]);
  return rows;
};

export const findById = async articleId => {
  const { rows } = await db.query(
    `select * from articles where article_id = $1`,
    [articleId]
  );
  return rows[0];
};

export const articleExists = async articleId => {
  const query = format(
    `--sql
    select exists(
        select 1 from articles
        where article_id = %L
    )`,
    articleId
  );
  const { rows } = await db.query(query);

  return rows[0];
};

export const updateVotes = async ({ articleId, inc_votes }) => {
  const query = format(
    `--sql
    update articles
    set votes = votes + %L
    where article_id = %L
    returning *
  `,
    inc_votes,
    articleId
  );
  const { rows } = await db.query(query);
  return rows[0];
};
