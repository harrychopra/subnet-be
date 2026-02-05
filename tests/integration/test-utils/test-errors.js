import request from 'supertest';
import app from '../../../src/app.js';

export function testMethodNotAllowed(
  url,
  methods = ['post', 'put', 'patch', 'delete']
) {
  for (const method of methods) {
    const methodName = method.toUpperCase();
    test(`rejects ${methodName} requests with 405`, async () => {
      const resp = await request(app)[method](url).expect(405);

      const { body: { error } } = resp;
      expect(error).toBe(`Method ${methodName} not allowed`);
    });
  }
}
