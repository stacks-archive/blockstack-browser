import { BrowserContext } from 'playwright-core';

export const setupMocks = async (context: BrowserContext) => {
  await context.route('https://test-registrar.blockstack.org/register', route => {
    void route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: '{}',
    });
  });
  await context.route('https://stats.blockstack.xyz/api/event', route => {
    void route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
    });
  });
  await context.route('https://hub.blockstack.org/hub_info', route => {
    void route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        challenge_text:
          '["gaiahub","0","storage2.blockstack.org","blockstack_storage_please_sign"]',
        latest_auth_version: 'v1',
        max_file_upload_size_megabytes: 20,
        read_url_prefix: 'https://gaia.blockstack.org/hub/',
      }),
    });
  });
  await context.route('https://hub.blockstack.org/store/*/profile.json', route => {
    void route.fulfill({
      status: 200,
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({
        publicURL: 'http://example.com',
      }),
    });
  });
  // Uncomment this code to inspect XHR requests, which we can mock, in order to speed
  // up integration tests.
  // await context.route('https://**', route => {
  //   const url = route.request().url();
  //   console.log(`Route to mock:`, url);
  //   void route.continue();
  // });
};
