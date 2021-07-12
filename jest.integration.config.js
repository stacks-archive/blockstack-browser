const config = require('./jest.config');

module.exports = {
  ...config,
  globalSetup: '<rootDir>/tests/global-setup.ts',
  globalTeardown: '<rootDir>/tests/global-teardown.ts',
};
