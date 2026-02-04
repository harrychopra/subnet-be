import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';

beforeEach(async () => await seed());
afterAll(() => db.end());

describe('/api/topics', () => {
  describe('GET', () => {
    test('returns all topics', async () => {
      const resp = await request(app).get('/api/topics').expect(200);

      const { body: { topics } } = resp;
      expect(topics).toBeArray();
      expect(topics.length).toBeGreaterThan(0);
    });

    test('returns topics with correct properties', async () => {
      const resp = await request(app).get('/api/topics');

      const { body: { topics } } = resp;
      topics.forEach(topic => {
        expect(topic).toContainAllKeys(['slug', 'description']);
      });
    });

    test('returns topics with correct data types', async () => {
      const resp = await request(app).get('/api/topics');

      const { body: { topics } } = resp;
      topics.forEach(topic => {
        expect(topic.slug).toBeString();
        expect(topic.description).toBeString();
      });
    });
  });
  describe('Method not allowed', () => {
    const methods = ['post', 'put', 'patch', 'delete'];

    for (const method of methods) {
      const methodName = method.toUpperCase();
      test(`rejects ${methodName} requests with 405`, async () => {
        const resp = await request(app)[method]('/api/topics').expect(405);

        const { body: { error } } = resp;
        expect(error).toBe(`Method ${methodName} not allowed`);
      });
    }
  });
});
