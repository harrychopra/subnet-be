import db from '../db/db.js';

afterAll(() => db.end());

describe('DB Connector', () => {
  test('has access to correct env vars for test db', async () => {
    expect(process.env.PGDATABASE).toBe('subnet_app_test');
    expect(process.env.PGHOST).toBe('localhost');
    expect(process.env.PGPORT).toBe('5432');
    expect(process.env.PGUSER).not.toBeEmpty();
    expect(process.env.PGPASSWORD).not.toBeEmpty();
  });
  test('successfully connects to the test db', async () => {
    const { rows } = await db.query(`select current_database()`);
    expect(rows).toBeArray();
    expect(rows).not.toBeEmpty();
    const { current_database } = rows[0];
    expect(current_database).toBe('subnet_app_test');
  });
});
