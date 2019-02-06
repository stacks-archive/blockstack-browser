const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const createTestSuites = require('../utils/create-test-suites');
const helpers = require('../utils/helpers');

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

// TODO: this needs configurable target a local instance
let browserUrl = 'https://browser.blockstack.org';

createTestSuites('account recovery', ({driver}) => {

  step('load initial page', async () => {
    await driver.get(browserUrl);
  });

  step('load sign in page', async () => {
    await driver.el(By.xpath('//a[contains(.,"Sign in with an existing ID")]'), el => el.click());
  });

});
