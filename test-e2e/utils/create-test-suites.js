
const { WebDriver, Builder, By, Key, until, logging } = require('selenium-webdriver');
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
const { getSessionConsoleLogs } = require('./browserstack-api');


// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html


/** @type {BrowserStackLocal} */
let browserStackLocalInstance;

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
    browserStackLocalInstance = new BrowserStackLocal();
    await new Promise((resolve, reject) => {
      const opts = {
        key: config.browserStack.key, 
        force: 'true',
        localIdentifier: config.browserStack.localIdentifier
      };
      browserStackLocalInstance.start(opts, (error) => {
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
  if (browserStackLocalInstance && browserStackLocalInstance.isRunning()) {
    await new Promise((resolve) => {
      browserStackLocalInstance.stop((error) => {
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
        driver: {},
        driverInitialized: false
      };

      // Variables that get populated when a test fails
      const failedTestInfo = {
        sessionID: '',
        testFileName: '',
        fileDir: ''
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
          testInputs.driverInitialized = true;
        };
        const timeout = new Promise((resolve, reject) => {
          setTimeout(() => {
            testInputs.driverInitialized 
              ? resolve() 
              : reject(new Error('Timeout waiting for webdriver instantiation'));
          }, 60000).unref(); 
        });
        await Promise.race([createDriver(), timeout]);
      });

      defineTests(testInputs)

      afterEach(function () {

        // If test failed then prepare for retrieving debug data (logs, screenshots).
        if (this.currentTest.state === 'failed' && testInputs.driverInitialized) {

          // Setup temp dir to write debug data, with a filename-safe description of the failed test. 
          const testDesc = this.currentTest.titlePath().join('-').replace(/\s+/g, '-');
          const testFileName = filenamify(`${testDesc}-${Date.now()/10000|0}-${helpers.getRandomString(5)}`);
          const fileDir = path.resolve(os.tmpdir(), 'test-errors');
          fs.mkdirSync(fileDir, { recursive: true });
          
          failedTestInfo.testFileName = testFileName;
          failedTestInfo.fileDir = fileDir;

          return Promise.resolve().then(async function getSessionID() {
            try {
              if (config.browserStack.enabled) {
                // If BrowserStack is enabled, get the sessionID which we need to retrieve the logs
                // after the session has been closed. 
                failedTestInfo.sessionID = await testInputs.driver.getSessionID();
              }
            } catch (error) {
              console.warn(`Error trying to get sessionID after test failure: ${error}`);
            }
          }).then(async function createScreenshotFile() {
            try {
              const screenshotFile = path.resolve(fileDir, `${testFileName}.png`);
              await testInputs.driver.screenshot(screenshotFile);
              console.log(`screenshot saved to "${screenshotFile}"`);
            } catch (error) {
              console.warn(`Error trying to create screenshot after test failure: ${error}`);
            }
          }).then(async function getSeleniumBrowserLogs(){
            try {
              const logData = await testInputs.driver.getBrowserLogs();
              const logFileDir = path.resolve(fileDir, `${testFileName}.selenium.log.txt`);
              fs.writeFileSync(logFileDir, logData);
              console.log(`selenium logs saved to "${logFileDir}"`);
            } catch (error) {
              console.warn(`Selenium log API not supported for this environment: ${error}`);
            }
          });
        }

      });

      after(async () => {

        try {
          if (testInputs.driverInitialized) {
            await testInputs.driver.quit();
          }
        } catch (error) {
          console.warn(`Error disposing driver after tests: ${error}`);
        }

        try {
          if (config.browserStack.enabled && failedTestInfo.sessionID) {
            // This must be ran after `driver.quit()` since BrowserStack logs are not available 
            // through their API until after the session has ended. 
            // Wait for BrowserStack backend to propagate log data before requesting..
            await helpers.timeout(2500);
            const logs = await getSessionConsoleLogs(failedTestInfo.sessionID);
            const logFilePath = path.resolve(failedTestInfo.fileDir, `${failedTestInfo.testFileName}.browserstack.log.txt`);
            fs.writeFileSync(logFilePath, logs);
            console.log(`BrowserStack log data saved to "${logFilePath}"`);
          }
        } catch (error) {
          console.warn(`Error fetching BrowserStack console logs: ${error}`);
        }

      });

    });
  }
}

module.exports = createTestSuites;
