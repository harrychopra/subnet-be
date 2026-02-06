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

describe('Comments', () => {
  describe('GET: /api/articles/:article_id/comments', () => {
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
      await testInvalidId('/api/articles/:id/comments');
    });
  });

  describe('Method not allowed', () =>
    testMethodNotAllowed('/api/articles/1/comments'));
});
