import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';

beforeEach(() => seed());
afterAll(() => db.end());

describe('/api/users', () => {
  describe('GET', () => {
    test('returns all users', async () => {
      const resp = await request(app).get('/api/users').expect(200);
      const { body: { users } } = resp;
      expect(users).toBeArray();
      expect(users.length).toBeGreaterThan(0);
    });
    test('returns users with correct properties', async () => {
      const resp = await request(app).get('/api/users');
      const { body: { users } } = resp;
      users.forEach(user => {
        expect(user).toContainAllKeys(['username', 'name', 'avatar_url']);
      });
    });
    test('returns users with correct data types', async () => {
      const resp = await request(app).get('/api/users');
      const { body: { users } } = resp;
      users.forEach(user => {
        expect(user.username).toBeString();
        expect(user.name).toBeString();
        expect(user.avatar_url).toBeString();
      });
    });
  });

  describe('Method not allowed', () => {
    const methods = ['post', 'put', 'patch', 'delete'];

    for (const method of methods) {
      const methodName = method.toUpperCase();
      test(`rejects ${methodName} requests with 405`, async () => {
        const resp = await request(app)[method]('/api/users').expect(405);

        const { body: { error } } = resp;
        expect(error).toBe(`Method ${methodName} not allowed`);
      });
    }
  });
});
