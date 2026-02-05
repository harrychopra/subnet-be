import request from 'supertest';
import app from '../../src/app.js';

describe('Error Middleware', () => {
  describe('handleNotFound', () => {
    test('returns 404 with a message when a resource doesn\'t exist', async () => {
      const resp = await request(app).get('/this/resource/does/not/exists')
        .expect(404);

      const { body: { error } } = resp;
      expect(error).toBe('Resource not found');
    });
  });
});
