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
