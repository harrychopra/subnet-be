import request from 'supertest';
import db from '../../db/db.js';
import seed from '../../db/seeds/seed.js';
import app from '../../src/app.js';
import { testMethodNotAllowed } from './test-utils/test-errors.js';

beforeEach(() => seed());
afterAll(() => db.end());

describe('Users', () => {
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
    describe('Method not allowed', () => testMethodNotAllowed('/api/users'));
  });
  describe('/api/users/:username', () => {
    describe('GET', () => {
      test('returns a user by username', async () => {
        const resp = await request(app).get('/api/users/rogersop').expect(200);
        const { body: { user } } = resp;
        const expUser = {
          username: 'rogersop',
          name: 'paul',
          avatar_url:
            'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
        };
        expect(user).toEqual(expUser);
      });
      test('returns 404 with a message when user not found', async () => {
        const resp = await request(app).get('/api/users/xyz').expect(404);
        const { body: { error } } = resp;
        expect(error).toBe('User not found');
      });
    });
    describe('Method not allowed', () =>
      testMethodNotAllowed('/api/users/xyz'));
  });
});
