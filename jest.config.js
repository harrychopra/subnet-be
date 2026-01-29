export default {
  bail: 1,
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  testMatch: ['**/__tests__/**/*.test.js'],
  verbose: true,
  maxWorkers: 1
};
