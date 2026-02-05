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
