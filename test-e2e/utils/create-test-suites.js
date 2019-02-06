
const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ExtendedWebDriver = require('./ExtendedWebDriver');
const getTestEnvironments = require('./get-test-environments');
const helpers = require('./helpers');

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

/**
 * @typedef {Object} TestInputs
 * @property {ExtendedWebDriver} driver A ready to use WebDriver instance.
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

  for (const testEnvironment of getTestEnvironments()) {

    describe(`${title} [${testEnvironment.description}]`, () => {

      /** @type {TestInputs} */
      const testInputs = {
        envDesc: testEnvironment.description,
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
