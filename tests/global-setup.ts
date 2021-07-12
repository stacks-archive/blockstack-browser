const { setup: setupDevServer } = require('jest-dev-server');

module.exports = async function globalSetup() {
  await setupDevServer({
    command: 'yarn test:serve',
    launchTimeout: 10000,
    port: 3001,
  });
};
