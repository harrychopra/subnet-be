import db from '../db.js';
import seed from './seed.js';

try {
  await seed();
} catch (err) {
  console.error(`Failed to seed development db: ${err.message}`);
  console.error(err.stack);
} finally {
  await db.end();
}
