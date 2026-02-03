import format from 'pg-format';
import db from './db.js';
import setupSchema from './schemaSetup.js';

async function importSeedData() {
  const seedDataPath = `./seed-data/${process.env.NODE_ENV}/index.js`;
  return await import(seedDataPath);
}

async function insertData(table, data) {
  if (!data) {
    throw new Error(`No rows provided for table ${table}`);
  }
  const cols = Object.keys(data[0]);
  const rows = data.map(row => cols.map(col => row[col] ?? null));
  const query = format(
    `insert into %I (%I) VALUES %L returning *`,
    table,
    cols,
    rows
  );

  const result = await db.query(query);
  if (result.rowCount !== data.length) {
    throw new Error(
      `Expected ${data.length} inserts for ${table}, inserted ${result.rowCount}`
    );
  }

  return result.rows;
}

async function seed() {
  try {
    await setupSchema();

    const { default: { topics, users, articles, comments } } =
      await importSeedData();

    await insertData('users', users);

    await insertData('topics', topics);

    const articleRows = await insertData('articles', articles);

    // Create lookup table with title and article_id
    const articlesIdByTitle = articleRows.reduce(
      (lookup, { title, article_id }) => {
        lookup[title] = article_id;
        return lookup;
      },
      {}
    );

    const commentsWithArticleId = comments.map(comment => {
      return {
        article_id: articlesIdByTitle[comment.article_title],
        body: comment.body,
        votes: comment.votes,
        author: comment.author,
        created_at: comment.created_at
      };
    });

    await insertData('comments', commentsWithArticleId);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default seed;
