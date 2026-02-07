import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';
import {
  testInvalidId,
  testMethodNotAllowed
} from './test-utils/test-errors.js';

beforeEach(() => seed());
afterAll(() => db.end());

describe('Articles', () => {
  describe('GET: /api/articles', () => {
    test('returns all articles', async () => {
      const resp = await request(app).get('/api/articles').expect(200);

      const { body: { articles } } = resp;
      expect(articles).toBeArray();
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('Method not allowed', () => testMethodNotAllowed('/api/articles'));
});

describe('Article', () => {
  describe('GET: /api/articles/:article_id', () => {
    test('returns article by id', async () => {
      const resp = await request(app).get('/api/articles/1').expect(200);
      const { body: { article } } = resp;
      expect(article.article_id).toBe(1);
      expect(article.title).toBeString();
      expect(article.topic).toBeString();
      expect(article.author).toBeString();
      expect(article.body).toBeString();
      expect(article.created_at).toBeString();
      expect(article.votes).toBeNumber();
      expect(article.article_img_url).toBeString();
    });
    test('returns 404 with a message when article does not exist', async () => {
      const resp = await request(app).get('/api/articles/100').expect(404);

      const { body: { error } } = resp;
      expect(error).toBe('Article id not found');
    });
    test('returns 400 with a message when id is invalid', async () => {
      await testInvalidId('/api/articles/:id', 'article');
    });
  });
  describe('PATCH: /api/articles/:article_id', () => {
    test('updates article\'s votes with status 200', async () => {
      const payload = { inc_votes: 10 };
      await request(app).patch('/api/articles/1')
        .send(payload)
        .expect(200);
    });
    test('returns article with all the props and updated votes', async () => {
      const articleId = 1;
      // Article for reference
      const resp = await request(app).get(`/api/articles/${articleId}`);
      const origArticle = resp.body.article;

      const payload = { inc_votes: 10 };
      const resp2 = await request(app)
        .patch(`/api/articles/${articleId}`)
        .send(payload);

      const updArticle = resp2.body.article;
      expect(updArticle.article_id).toBe(origArticle.article_id);
      expect(updArticle.title).toBe(origArticle.title);
      expect(updArticle.topic).toBe(origArticle.topic);
      expect(updArticle.author).toBe(origArticle.author);
      expect(updArticle.body).toBe(origArticle.body);
      expect(updArticle.created_at).toBe(origArticle.created_at);
      expect(updArticle.votes).toBe(origArticle.votes + payload.inc_votes);
      expect(updArticle.article_img_url).toBe(origArticle.article_img_url);
    });
    test('persists updated article to database', async () => {
      const articleId = 1;
      const url = `/api/articles/${articleId}`;
      const payload = { inc_votes: 10 };

      // Get the article's vote count before update
      const { rows } = await db.query(
        `--sql
        select votes
        from articles
        where article_id = $1
        `,
        [articleId]
      );

      const origVotes = rows[0]['votes'];

      await request(app).patch(url).send(payload);

      const { rows: records } = await db.query(
        `--sql
        select votes
        from articles
        where article_id = $1
        `,
        [articleId]
      );

      const updVotes = records[0]['votes'];

      expect(updVotes).toBe(origVotes + payload.inc_votes);
    });
    test('returns 404 with a message when article does not exist', async () => {
      const payload = { inc_votes: 10 };
      const resp = await request(app).patch('/api/articles/100')
        .send(payload)
        .expect(404);

      const { body: { error } } = resp;
      expect(error).toBe('Article id not found');
    });
    test('returns 400 with a message when request has missing or invalid fields', async () => {
      const articleId = 1;
      const url = `/api/articles/${articleId}`;

      const testData = [
        { payload: {}, expError: 'Invalid input: inc_votes' },
        {
          payload: { inc_votes: 'ten' },
          expError: 'Invalid input: inc_votes'
        }
      ];

      for (const data of testData) {
        const resp = await request(app).patch(url).send(data.payload)
          .expect(400);

        const { body: { error } } = resp;
        expect(error).toBe(data.expError);
      }
    });
    test('returns 400 with a message when article id is invalid', async () => {
      await testInvalidId('/api/articles/:id', 'article', 'patch');
    });
  });

  describe('Method not allowed', () =>
    testMethodNotAllowed('/api/articles/1', ['post', 'put', 'delete']));
});
