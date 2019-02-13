
const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const chromeOptions = require('selenium-webdriver/chrome').Options;
const firefoxOptions = require('selenium-webdriver/firefox').Options;
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');
const { createServer: createHttpServer, Server: HttpServer } = require('http');
const serveHandler = require('serve-handler');
const { Local: BrowserStackLocal } = require('browserstack-local');
const ExtendedWebDriver = require('./ExtendedWebDriver');
const browserStackEnvironments = require('./browserstack-environments');
const helpers = require('./helpers');

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

const BROWSERSTACK_HUB_URL = 'http://hub-cloud.browserstack.com/wd/hub';
const BROWSERSTACK_LOOPBACK_HOST = 'bs-local.com';

const config = {
  browserHostUrl: '',
  browserStack: { 
    enabled: false, 
    user: '', 
    key: '', 
    localEnabled: false
  },
  serveDirectory: '',
  loopbackHost: 'localhost'
};

/**
 * Note: This config has to be loaded immediately and synchronously since the config values
 * are used for generating the Mocha test suites, and Mocha requires tests to be defined 
 * immediately and synchronously on script load. 
 */
(function initializeConfig() {

  // Determine which browser host endpoint to run tests against.
  const E2E_BROWSER_HOST = 'E2E_BROWSER_HOST';
  const PROD_HOST = 'https://browser.blockstack.org';
  config.browserHostUrl = process.env[E2E_BROWSER_HOST] || PROD_HOST;
  if (!process.env[E2E_BROWSER_HOST]) {
    console.warn(`WARNING: The browser host url was not set via the ${E2E_BROWSER_HOST} env var.. running tests against the production endpoint "${PROD_HOST}"`);
  } else if (config.browserHostUrl.startsWith('http:') || config.browserHostUrl.startsWith('https:')) {
    console.log(`Running e2e tests against endpoint ${config.browserHostUrl}`);
  } else {
    config.serveDirectory = path.resolve(config.browserHostUrl);
    config.browserHostUrl = 'http://localhost:5757';
    console.log(`Local static web server will be started at ${config.browserHostUrl} for directory ${config.serveDirectory}`);
  }

  // Check environment vars for BrowserStack usage settings.
  const USE_BROWSERSTACK = 'USE_BROWSERSTACK';
  const BROWSERSTACK_AUTH = 'BROWSERSTACK_AUTH';
  config.browserStack.enabled = process.env[USE_BROWSERSTACK] && process.env[USE_BROWSERSTACK] !== 'false';
  if (config.browserStack.enabled) {
    const browserstackAuth = process.env[BROWSERSTACK_AUTH];
    if (!browserstackAuth) {
      const errMsg = `The BrowserStack auth must be set as environment variables. Use the format \`${BROWSERSTACK_AUTH}="user:key"\``;
      console.error(errMsg);
      throw new Error(errMsg);
    }
    // Auth string formatted as "user:key"
    [config.browserStack.user, config.browserStack.key] = browserstackAuth.trim().split(/:(.+)/);
  }

  /**
   * If the auth-browser host endpoint is set to localhost and BrowserStack testing is enabled
   * then BrowserStack Local must be used.
   * @see https://www.npmjs.com/package/browserstack-local
   * @see https://www.browserstack.com/local-testing
   */
  if (config.browserStack.enabled) {
    const parsedUrl = url.parse(config.browserHostUrl);
    config.browserStack.localEnabled = ['localhost', '127.0.0.1'].includes(parsedUrl.hostname);

    /** 
     * Check if the host port is the expected port that is supported by BrowserStack Safari environments.
     * @see https://www.browserstack.com/question/664
     */
    const expectedPort = '5757';
    if (config.browserStack.localEnabled && parsedUrl.port !== expectedPort) {
      console.warn(`WARNING: BrowserStack Local is enabled but the host port is ${parsedUrl.port} rather than the expected port ${expectedPort}. ` + 
        `This may cause problems for BrowserStack Safari environments.. for more information see https://www.browserstack.com/question/664`);
    }
  }

  /**
   * If BrowserStack Local is enabled then the host url needs swapped from localhost to bs-local.com
   * This required due to a technical limitation with BrowserStack's Safari environments.
   * @see https://www.browserstack.com/question/759
   */
  if (config.browserStack.localEnabled) {
    const parsedUrl = url.parse(config.browserHostUrl);
    [ parsedUrl.hostname, parsedUrl.host ] = [ BROWSERSTACK_LOOPBACK_HOST, undefined ];
    config.browserHostUrl = url.format(parsedUrl);
    config.loopbackHost = BROWSERSTACK_LOOPBACK_HOST;
  }

  // Trim trailing url slash(es).
  config.browserHostUrl = config.browserHostUrl.replace(/\/+$/, "");

})();


/** @type {BrowserStackLocal} */
let blockStackLocalInstance;

/** @type {HttpServer} */
let staticWebServer;

before(async () => {

  // Check if a local static web server needs to be started
  if (config.serveDirectory) {
    console.log(`Starting static web server for a directory to host the Browser locally...`)
    staticWebServer = createHttpServer((req, res) => {
      return serveHandler(req, res, {
        public: config.serveDirectory,
        rewrites: [{ source: '**', destination: '/index.html' }]
      })
    });
    await new Promise((resolve, reject) => {
      staticWebServer.unref();
      staticWebServer.listen(url.parse(config.browserHostUrl).port, error => {
        if (error) {
          console.error(`Error starting web server: ${error}`);
          reject(error);
        } else {
          console.log(`Web server started at http://localhost:${staticWebServer.address().port}`);
          resolve();
        }
      });
    });
  }

  // Check if BrowserStackLocal needs to be initialized before running tests..
  if (config.browserStack.localEnabled) {
    console.log(`BrowserStack is enabled the test endpoint is localhost, setting up BrowserStack Local..`);
    blockStackLocalInstance = new BrowserStackLocal();
    return await new Promise((resolve, reject) => {
      blockStackLocalInstance.start({ key: config.browserStack.key, force: 'true' }, (error) => {
        if (error) {
          console.error(`Error starting BrowserStack Local: ${error}`);
          reject(error)
        } else {
          console.log(`BrowserStack Local started`);
          resolve();
        }
      });
    });
  }

});

after(async () => {

  // Check if a local web server needs to be shutdown
  if (staticWebServer && staticWebServer.listening) {
    await new Promise((resolve) => {
      staticWebServer.close(error => {
        if (error) {
          console.error(`Error stopping local static web server: ${error}`);
        }
        resolve();
      });
    });
  }

  // Check if BrowserStackLocal needs to be disposed off after running tests..
  if (blockStackLocalInstance && blockStackLocalInstance.isRunning()) {
    await new Promise((resolve) => {
      blockStackLocalInstance.stop((error) => {
        if (error) {
          console.error(`Error stopping BrowserStack Local: ${error}`);
        }
        resolve();
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
    if (config.browserStack.localEnabled) {
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

  // Disable Chrome's protocol handler for `blockstack:` in case the native browser is installed on this machine
  // https://stackoverflow.com/a/41299296/794962
  const chromeOpts = new chromeOptions().setUserPreferences({
    protocol_handler: { excluded_schemes: { 'blockstack': true } }
  });

 // Disable Firefox's protocol handler for `blockstack:` in case the native browser is installed on this machine
 // https://stackoverflow.com/a/53154527/794962
  const firefoxOpts = (() => {
    const handlers = '{"defaultHandlersVersion":{"en-US":4},"schemes":{"blockstack":{"action":2,"handlers":[{"name":"None","uriTemplate":"#"}]}}}';
    const tempDir = path.resolve(os.tmpdir(), helpers.getRandomString());
    fs.mkdirSync(tempDir);
    fs.writeFileSync(path.resolve(tempDir, 'handlers.json'), handlers);
    return new firefoxOptions().setProfile(tempDir);
  })();

  for (let browser of new Set(browsers)) {
    yield {
      description: `${process.platform} ${browser}`,
      createDriver: async () => {        
        const driver = await new Builder()
          .forBrowser(browser)
          .setChromeOptions(chromeOpts)
          .setFirefoxOptions(firefoxOpts)
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

  const testEnvironments = config.browserStack.enabled 
    ? getBrowserstackEnvironments(config.browserStack.user, config.browserStack.key)
    : getLocalSystemBrowserEnvironments();

  for (const testEnvironment of testEnvironments) {

    describe(`${title} [${testEnvironment.description}]`, () => {

      /** @type {TestInputs} */
      const testInputs = {
        envDesc: testEnvironment.description,
        browserHostUrl: config.browserHostUrl,
        loopbackHost: config.loopbackHost,
        driver: {}
      };

      step('create selenium webdriver', async () => {
        const driver = await testEnvironment.createDriver();
        helpers.mixin(testInputs.driver, driver);
      }).timeout(120000);

      defineTests(testInputs)

      afterEach(function () {
        try {
          // If test failed then take a screenshot and save to local temp dir.
          if (this.currentTest.state === 'failed' && testInputs.driver.screenshot) {
            let screenshotFile = `screenshot-${Date.now()/1000|0}-${helpers.getRandomString(6)}.png`;
            screenshotFile = path.resolve(os.tmpdir(), screenshotFile);
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
          if (testInputs.driver.quit) {
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
