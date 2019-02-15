
const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');
const filenamify = require('filenamify');
const { createServer: createHttpServer, Server: HttpServer } = require('http');
const serveHandler = require('serve-handler');
const { Local: BrowserStackLocal } = require('browserstack-local');
const ExtendedWebDriver = require('./ExtendedWebDriver');
const helpers = require('./helpers');
const config = require('./config');
const { getTestEnvironments } = require('./webdriver-environments');

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html


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
 * @typedef {Object} TestInputs
 * @property {ExtendedWebDriver} driver A ready to use WebDriver instance.
 * @property {string} browserHostUrl The http endpoint hosting the browser.
 * @property {string} envDesc Human-readable name of the operating system & web browser.
 * @property {string} browserName Lowercase name of web browser (for mobile this can be 'android' or 'iphone').
 * @property {boolean} browserStackEnabled If testing against BrowserStack is enabled.
 * @property {string} loopbackHost Typically `localhost`, otherwise set to BrowserStack's loopback domain.
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

  const testEnvironments = getTestEnvironments();
  for (const testEnvironment of testEnvironments) {

    describe(`${title} [${testEnvironment.description}]`, function() {

      if (config.browserStack.enabled) {
        this.retries(1);
      }

      /** @type {TestInputs} */
      const testInputs = {
        envDesc: testEnvironment.description,
        browserName: testEnvironment.browserName,
        browserHostUrl: config.browserHostUrl,
        browserStackEnabled: config.browserStack.enabled,
        loopbackHost: config.loopbackHost,
        driver: {}
      };

      step('create selenium webdriver', async () => {
        // BrowserStack sometimes lets webdriver instantiation network requests go into a zombie 
        // state (no response, no error) after several minutes, causing a Mocha test timeout 
        // with cascading effects that prevent the `retries` feature from working properly. 
        // There is no easy way to set a timeout or cancel this webdriver network request, so we 
        // use a manual Promise race to detect timeout and fail the test. 
        const createDriver = async () => {
          const driver = await testEnvironment.createDriver();
          helpers.mixin(testInputs.driver, driver);
        };
        const timeout = new Promise((_, reject) => setTimeout(() => {
          reject(new Error('Timeout waiting for webdriver instantiation'));
        }, 60000));
        await Promise.race([createDriver(), timeout]);
      });

      defineTests(testInputs)

      afterEach(function () {
        try {
          // If test failed then take a screenshot and save to local temp dir.
          if (this.currentTest.state === 'failed' && testInputs.driver.screenshot) {
            let screenshotDir = path.resolve(os.tmpdir(), 'screenshots');
            fs.mkdirSync(screenshotDir, { recursive: true });
            let testDesc = filenamify(this.currentTest.titlePath().join('-').replace(/\s+/g, '-'));
            let screenshotFile = `${testDesc}-${Date.now()/10000|0}-${helpers.getRandomString(5)}.png`;
            screenshotFile = path.resolve(screenshotDir, screenshotFile);
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
