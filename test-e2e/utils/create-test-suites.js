
const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');
const browserStackLocal = require('browserstack-local').Local;
const ExtendedWebDriver = require('./ExtendedWebDriver');
const browserStackEnvironments = require('./browserstack-environments');
const helpers = require('./helpers');

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';


// Determine which browser host endpoint to run tests against.
const browserHostUrl = (() => {
  const E2E_BROWSER_HOST = 'E2E_BROWSER_HOST';
  const PROD_HOST = 'https://browser.blockstack.org';
  const hostUrl = process.env[E2E_BROWSER_HOST] || PROD_HOST;
  if (!process.env[E2E_BROWSER_HOST]) {
    console.warn(`Warning: The browser host url was not set via the ${E2E_BROWSER_HOST} env var.. running tests against the production endpoint "${PROD_HOST}"`);
  } else {
    console.log(`Running e2e tests against endpoint ${hostUrl}`);
  }
  return hostUrl;
})();

/**
 * Checks environment vars for BrowserStack usage settings.
 */
const browserStackConfig = (() => {
  const USE_BROWSERSTACK = 'USE_BROWSERSTACK';
  const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';
  const config = { 
    enabled: process.env[USE_BROWSERSTACK] && process.env[USE_BROWSERSTACK] !== 'false', 
    user: '', key: ''
  };
  if (config.enabled) {
    const browserstackAuth = process.env[BROWSERSTACK_AUTH];
    if (!browserstackAuth) {
      const errMsg = `The BrowserStack auth must be set as environment variables. Use the format \`${BROWSERSTACK_AUTH}="user:key"\``;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    // Auth string formatted as "user:key"
    [config.user, config.key] = browserstackAuth.trim().split(/:(.+)/);
  }
  return config;
})();

/**
 * True if the auth-browser host endpoint is set to localhost and BrowserStack testing is enabled.
 * @see {@link https://www.npmjs.com/package/browserstack-local }
 * @see {@link https://www.browserstack.com/local-testing }
 */
const browserStackLocalEnabled = (() => {
  const isLocalhost = ['localhost', '127.0.0.1'].includes(url.parse(browserHostUrl).hostname);
  return isLocalhost && browserStackConfig.enabled;
})();


let blockStackLocalInstance;
before(async () => {
  // Check if BrowserStackLocal needs to be initialized before running tests..
  if (browserStackLocalEnabled) {
    console.log(`BrowserStack is enabled the test endpoint is localhost, setting up BrowserStack Local..`);
    blockStackLocalInstance = new browserStackLocal();
    return await new Promise((resolve, reject) => {
      blockStackLocalInstance.start({ key: browserStackConfig.key, force: 'true' }, (error) => {
        if (error) {
          console.error(`Error starting BrowserStack Local: ${error}`);
          reject(error)
        } else {
          console.log(`BrowserStack Local started`);
          resolve(browserHostUrl);
        }
      });
    });
  }
});
after(() => {
  // Check if BrowserStackLocal needs to be disposed off after running tests..
  if (blockStackLocalInstance && blockStackLocalInstance.isRunning()) {
    return new Promise((resolve, reject) => {
      blockStackLocalInstance.stop((error) => {
        if (error) {
          console.error(`Error stopping BrowserStack Local: ${error}`);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
});


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
    if (browserStackLocalEnabled) {
      capability['browserstack.local'] = 'true';
    }
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
function* getLocalSystemBrowserEnvironments() {
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
 * @typedef {Object} TestInputs
 * @property {ExtendedWebDriver} driver A ready to use WebDriver instance.
 * @property {string} browserHostUrl The http endpoint hosting the browser.
 * @property {string} envDesc Human-readable name of the operating system & web browser.
 */

/**
 * @callback DefineTestsCallback
 * @param {TestInputs} testInputs
 * @returns {void}
 */

/**
 * @param {string} title Test suite title used in the `describe` statement.
 * @param {DefineTestsCallback} defineTests 
 *   Callback that is invoked for each test environment. 
 *   Mocha test (`it`, `step`, etc) should be defined inside in this callback. 
 *   Any test failures automatically trigger a screenshot that is written to file. 
 *   The WebDriver instance is automatically disposed/quitted at the end of the test suite. 
 */
function createTestSuites(title, defineTests) {

  const testEnvironments = browserStackConfig.enabled 
    ? getBrowserstackEnvironments(browserStackConfig.user, browserStackConfig.key)
    : getLocalSystemBrowserEnvironments();

  for (const testEnvironment of testEnvironments) {

    describe(`${title} [${testEnvironment.description}]`, () => {

      /** @type {TestInputs} */
      const testInputs = {
        envDesc: testEnvironment.description,
        browserHostUrl: browserHostUrl,
        driver: {}
      };

      step('create selenium webdriver', async () => {
        const driver = await testEnvironment.createDriver();
        helpers.mixin(testInputs.driver, driver);
      }).timeout(120000);

      defineTests(testInputs)

      afterEach(function () {
        try {
          if (this.currentTest.state === 'failed' && testInputs.driver) {
            const errDir = path.resolve(os.tmpdir(), 'selenium-errors');
            if (!fs.existsSync(errDir)) { fs.mkdirSync(errDir, { recursive: true }); }
            const screenshotFile = path.resolve(errDir, `screenshot-${Date.now() / 1000 | 0}-${helpers.getRandomString(6)}.png`);
            return testInputs.driver.screenshot(screenshotFile).then(() => {
              console.log(`screenshot for failure saved to ${screenshotFile}`);
            }).catch(err => console.warn(`Error trying to create screenshot after test failure: ${err}`));
          }
        } catch (err) {
          console.warn(`Error trying to create screenshot after test failure: ${err}`);
        }
      });

      after(async () => {
        try {
          if (testInputs.driver) {
            await testInputs.driver.quit();
          }
        } catch (err) {
          console.warn(`Error disposing driver after tests: ${err}`);
        }
      });

    });
  }
}

module.exports = createTestSuites;
