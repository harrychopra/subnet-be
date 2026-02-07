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

export async function testInvalidId(endpoint, method = 'get') {
  const ids = [0, -1, 'abc'];

  const requests = ids.map(async id => {
    const url = endpoint.replace(':id', id);
    const resp = await request(app)[method](url).expect(400);

    const { body: { error } } = resp;
    expect(error).toBe('Invalid article id/ format');
  });

  await Promise.all(requests);
}
