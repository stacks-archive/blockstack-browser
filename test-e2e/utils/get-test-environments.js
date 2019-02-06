const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const ExtendedWebDriver = require('./ExtendedWebDriver');
const browserStackEnvironments = require('./browserstack-environments');

const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';
const USE_BROWSERSTACK = 'USE_BROWSERSTACK';
const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';

/**
 * @typedef {Object} TestEnvironment
 * @property {string} description Human-readable name of the operating system & web browser.
 * @property {Promise<ExtendedWebDriver>} createDriver Promise that resolves to a ready-to-use WebDriver instance.
 */

/**
 * @generator
 * @param {string} user BrowserStack user credential.
 * @param {string} key BrowserStack key credential.
 * @yields {TestEnvironment}
 */
function* getBrowserstackEnvironments(user, key) {
  for (let capability of browserStackEnvironments) {
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
        return new ExtendedWebDriver(driver);
      }
    };
  }
}

/**
 * Generates test environments for the local machine. Always includes 'chrome' and 'firefox'.
 * If on macOS then also includes 'safari'. If on Windows then also includes 'edge'. 
 * @generator
 * @yields {TestEnvironment}
 */
function* getLocalBrowserEnvironments() {
  const browsers = ['firefox', 'chrome'];

  // Ensure the browser webdriver binaries are added to env path
  require('chromedriver');
  require('geckodriver');

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
        return new ExtendedWebDriver(driver);
      }
    };
  }
}

/**
 * Generates test selenium environments for either the local machine or BrowserStack, depending
 * on the configured environmental variables.
 * @generator
 * @yields {TestEnvironment}
 */
function getTestEnvironments () {
  const useBrowserstack = process.env[USE_BROWSERSTACK];
  const browserstackAuth = process.env[BROWSERSTACK_AUTH];
  if (useBrowserstack && useBrowserstack !== 'false') {
    if (!browserstackAuth) {
      const errMsg = `The BrowserStack auth must be set as environment variables. Use the format \`BROWSERSTACK_AUTH="user:key"\``;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    // Auth string formatted as "user:key"
    const [user, key] = browserstackAuth.trim().split(/:(.+)/);
    return getBrowserstackEnvironments(user, key)
  } else {
    return getLocalBrowserEnvironments()
  }
};

module.exports = getTestEnvironments;
