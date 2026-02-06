import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';
import { testMethodNotAllowed } from './test-utils/test-errors.js';

beforeEach(() => seed());
afterAll(() => db.end());

describe('/api/articles', () => {
  describe('GET', () => {
    test('returns all articles', async () => {
      const resp = await request(app).get('/api/articles').expect(200);

      const { body: { articles } } = resp;
      expect(articles).toBeArray();
      expect(articles.length).toBeGreaterThan(0);
    });
  });

  describe('Method not allowed', () => testMethodNotAllowed('/api/articles'));
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
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
      const ids = [0, -1, 'abc'];
      const requests = ids.map(async id => {
        const resp = await request(app).get(`/api/articles/${id}`).expect(400);

        const { body: { error } } = resp;
        expect(error).toBe('Invalid article id/ format');
      });

      await Promise.all(requests);
    });
  });

  describe('Method not allowed', () => testMethodNotAllowed('/api/articles/1'));
});

describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('returns all comments for an article', async () => {
      const articleIds = [1, 2, 3];
      const requests = articleIds.map(async articleId => {
        const resp = await request(app).get(
          `/api/articles/${articleId}/comments`
        ).expect(200);

        const { body: { comments } } = resp;
        expect(comments).toBeArray();

        const { rows } = await db.query(
          `--sql
          select *
          from comments
          where article_id = $1`,
          [articleId]
        );
        expect(comments.length).toBe(rows.length);
      });

      await Promise.all(requests);
    });
    test('returns comments with correct properties', async () => {
      const resp = await request(app).get('/api/articles/1/comments');

      const { body: { comments } } = resp;
      comments.forEach(comment => {
        expect(comment).toContainAllKeys([
          'comment_id',
          'votes',
          'created_at',
          'author',
          'body',
          'article_id'
        ]);
      });
    });
    test('returns comments with correct data types', async () => {
      const resp = await request(app).get('/api/articles/1/comments');
      const { body: { comments } } = resp;

      comments.forEach(comment => {
        expect(comment.comment_id).toBeNumber();
        expect(comment.article_id).toBeNumber();
        expect(comment.votes).toBeNumber();
        expect(comment.created_at).toBeString();
        expect(comment.author).toBeString();
        expect(comment.body).toBeString();
      });
    });
    test('returns comments sorted by newest first', async () => {
      const resp = await request(app).get('/api/articles/1/comments');

      const { body: { comments } } = resp;
      expect(comments).toBeSorted({ descending: true, key: 'created_at' });
    });
    test('returns 404 with a message when article does not exist', async () => {
      const resp = await request(app).get('/api/articles/100/comments').expect(
        404
      );

      const { body: { error } } = resp;
      expect(error).toBe('Article id not found');
    });
    test('returns 400 with a message when id is invalid', async () => {
      const ids = [0, -1, 'abc'];
      const requests = ids.map(async id => {
        const resp = await request(app).get(`/api/articles/${id}/comments`)
          .expect(400);

        const { body: { error } } = resp;
        expect(error).toBe('Invalid article id/ format');
      });

      await Promise.all(requests);
    });
  });

  describe('Method not allowed', () =>
    testMethodNotAllowed('/api/articles/1/comments'));
});
