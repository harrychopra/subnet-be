import setupSchema from './schemaSetup.js';

async function seed() {
  try {
    await setupSchema();
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export default seed;
