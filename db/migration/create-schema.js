import db from '../db.js';

export default async () => {
  const schemaQueries = [
    `DROP INDEX IF EXISTS idx_comments_author`,

    `DROP INDEX IF EXISTS idx_comments_article_id`,

    `DROP INDEX IF EXISTS idx_articles_author`,

    `DROP INDEX IF EXISTS idx_articles_topic`,

    `DROP TABLE IF EXISTS comments`,

    `DROP TABLE IF EXISTS articles`,

    `DROP TABLE IF EXISTS topics`,

    `DROP TABLE IF EXISTS users`,

    `CREATE TABLE users (
        username varchar(25) PRIMARY key NOT NULL,
        name varchar(50) NOT NULL,
        avatar_url varchar(1000)
    )`,

    `CREATE TABLE topics (
        slug varchar(25) PRIMARY key,
        description varchar(100) NOT NULL,
        img_url varchar(1000)
    )`,

    `CREATE TABLE articles (
        article_id serial PRIMARY key,
        title varchar(100) NOT NULL,
        topic varchar(25) NOT NULL REFERENCES topics (slug),
        author varchar(25) NOT NULL REFERENCES users (username),
        body text NOT NULL,
        created_at timestamp DEFAULT current_timestamp,
        votes int DEFAULT 0,
        article_img_url varchar(1000)
    )`,

    `CREATE TABLE comments (
        comment_id serial PRIMARY key,
        article_id int NOT NULL REFERENCES articles (article_id),
        body text NOT NULL,
        votes int DEFAULT 0,
        author varchar(25) NOT NULL REFERENCES users (username),
        created_at timestamp DEFAULT current_timestamp
    )`,

    `CREATE INDEX idx_articles_topic ON articles (topic)`,

    `CREATE INDEX idx_articles_author ON articles (author)`,

    `CREATE INDEX idx_comments_article_id ON comments (article_id)`,

    `CREATE INDEX idx_comments_author ON comments (author)`
  ];

  try {
    for (const query of schemaQueries) {
      await db.query(query);
    }
  } catch (err) {
    throw new Error(`Schema creation failed: ${err}`);
  }
};
