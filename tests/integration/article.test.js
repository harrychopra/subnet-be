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
      await testInvalidId('/api/articles/:id');
    });
  });

  describe('Method not allowed', () => testMethodNotAllowed('/api/articles/1'));
});
