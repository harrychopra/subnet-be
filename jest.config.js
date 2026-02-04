export default {
  bail: 1,
  transform: {},
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  verbose: true,
  maxWorkers: 1
};
