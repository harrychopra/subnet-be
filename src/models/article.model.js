import db from '../../db/db.js';

export const findAll = async () => {
  const query = `--sql
    select a.title, a.topic, a.author, a.votes, a.article_img_url, a.created_at,
        coalesce(c.comment_count, 0)
    from articles as a
    left join (
        select article_id, count(*) as comment_count
        from comments
        group by article_id
    ) as c
    on c.article_id = a.article_id
    order by a.created_at desc
    `;

  const { rows } = await db.query(query);
  return rows;
};
