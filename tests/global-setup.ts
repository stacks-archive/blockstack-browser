import { setup } from 'jest-dev-server';

export default async function globalSetup() {
  await setup({
    command: 'yarn test:serve',
    launchTimeout: 10000,
    port: 3001,
  });
}
