const { Builder } = require('selenium-webdriver');

const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';

const USE_BROWSERSTACK = 'USE_BROWSERSTACK',
      BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';

function* getBrowserstackEnvironments(browserstackAuth) {
  // Auth string formatted as "user:key"
  const [user, key] = browserstackAuth.trim().split(/:(.+)/);
  const capabilities = require('./browserstack-capabilities');

  for (let capability of capabilities) {
    capability = Object.assign(capability, {
      'browserstack.user': user,
      'browserstack.key': key
    });
    yield {
      description: capability.desc,
      createDriver: async () => {
        const driver = await new Builder().
          usingServer(BROWSERSTACK_HUB_URL).
          withCapabilities(capability).
          build();
        await driver.manage().setTimeouts({ implicit: 1000, pageLoad: 10000 });
        return driver;
      }
    };
  }
}

function* getLocalBrowserEnvironments() {
  const browsers = ['firefox', 'chrome'];
  if (process.platform === 'darwin') {
    browsers.push('safari');
  } else if (process.platform === 'win32') {
    browsers.push('edge');
  }
  for (let browser of new Set(browsers)) {
    yield {
      description: `${process.platform} ${browser}`,
      createDriver: async () => {
        const driver = await new Builder()
          .forBrowser(browser)
          .build();
        await driver.manage().setTimeouts({ implicit: 1000, pageLoad: 10000 });
        return driver;
      }
    };
  }
}

module.exports.getTestEnvironments = function () {
  const useBrowserstack = process.env[USE_BROWSERSTACK],
    browserstackAuth = process.env[BROWSERSTACK_AUTH];
  if (useBrowserstack && useBrowserstack !== 'false') {
    if (!browserstackAuth) {
      const errMsg = `${USE_BROWSERSTACK} env var enabled but ${BROWSERSTACK_AUTH} has not been set.`;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    return getBrowserstackEnvironments(browserstackAuth)
  } else {
    return getLocalBrowserEnvironments()
  }
};
