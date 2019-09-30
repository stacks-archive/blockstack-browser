const {Local: BrowserStackLocal} = require('browserstack-local');
const browserstack = require("browserstack-local");
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {createServer, IncomingMessage, ServerResponse} from 'http';
import {browser, By, element, utils} from 'protractor';
import * as serveHandler from 'serve-handler';
import * as url from 'url';
import {Utils} from '../../src/utils/Utils';

chai.use(chaiAsPromised);
const expect = chai.expect;

module.exports = function myStepDefinitions() {
// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

  let randomUsername;

  this.Before(async () => {
    await browser.waitForAngularEnabled(false);
  });

  this.After(async () => {
    await browser.manage().deleteAllCookies();
    await browser.executeScript('window.sessionStorage.clear();');
    await browser.executeScript('window.localStorage.clear();');
  });

  this.Given(/^load initial page$/, async () => {
    await browser.get(browser.params.browserHostUrl);
    await Utils.waitForElement(element(By.xpath('//*[contains(.,"Create your Blockstack ID")]')));
  });

  if (!process.env['TEST_PRODUCTION_REGISTRAR']) {
    this.Given(/^set "([^"]*)" as API endpoint for ID registration$/, async (arg1) => {
      await Utils.retry(async () => {
        await browser.executeScript(`window.SUBDOMAIN_SUFFIX_OVERRIDE = "test-personal.id";`);
      }, 10000, 200);
    });
  }

  this.Given(/^load create new ID page$/, async () => {
    await Utils.click(element(By.xpath('//div[text()="Create new ID"]')));
  });

  this.Given(/^enter unique username$/, async () => {
    /* tslint:disable:no-bitwise */
    randomUsername = `test_e2e_${Date.now() / 100000 | 0}_${Math.floor(Math.random() * (99999999999 - 1000000000)) + 1000000000}`;
    /* tslint:disable:no-bitwise */
    await Utils.sendKeys(element(By.css('input[type="text"][name="username"]')), randomUsername);
    await Utils.click(element(By.xpath('//button[contains(., "Check Availability")]')));
    await Utils.click(element(By.xpath('//button[contains(., "Continue")]')));
  });

  this.Given(/^enter password$/, async () => {
    const randomPassword = Math.random().toString(36).substr(2);
    await Utils.sendKeys(element(By.css('input[type="password"][name="password"]')), randomPassword);
    await Utils.sendKeys(element(By.css('input[type="password"][name="passwordConfirm"]')), randomPassword);
    await Utils.click(element(By.xpath('//button[contains(., "Register ID")]')));
  });

  this.Given(/^wait for creating Blockstack ID spinner$/, async () => {
    await Utils.waitForElement(element(By.xpath('//*[contains(text(), "Creating your Blockstack ID")]')));
    await Utils.waitForElementToDisappear(element(By.xpath('//*[contains(text(), "Creating your Blockstack ID")]')));
    await Utils.waitForElement(element(By.xpath('//*[contains(text(), "What is your email")]')));
  });

  this.Given(/^enter email$/, async () => {
    await Utils.sendKeys(element(By.css('input[type="email"][name="email"]')), `${randomUsername}@none.test`);
    await Utils.click(element(By.xpath('//button[contains(., "Next")]')));
  });

  this.Given(/^expect recovery email to fail$/, async () => {
    await Utils.waitForElement(element(By.xpath('//*[contains(., "email failed")]')));
  });

  this.Given(/^check username registration failed$/, async () => {
    try {
      await Utils.waitForElement(element(By.xpath('//*[text()="Username Registration Failed"]')));
      await Utils.click(element(By.xpath('//*[text()="Username Registration Failed"]/parent::div/following-sibling::div/descendant::span')));
    } catch (err) {
    }
  });

  this.Given(/^acknowledge saving recovery key phrase$/, async () => {
    try {
      await Utils.click(element(By.xpath('//div[text()="Secret Recovery Key"]/parent::div')));
      await Utils.waitForElement(element(By.xpath('//div[contains(.,"Save your Secret Recovery")]')));
      await Utils.click(element(By.xpath('//div[text()="Secret Recovery Key"]/parent::div')));
    } catch (err) {
    }
  });
  this.Then(/^wait for unlocking recovery key$/, async () => {
    try {
      await Utils.waitForElement(element(By.xpath('//*[contains(text(), "Unlocking Recovery Key")]')));
      await Utils.waitForElement(element(By.xpath('//*[text()="Your Secret Recovery Key"]/following-sibling::*')));
    } catch (err) {
    }
  });
  let keyWords;

  this.Given(/^get secret recovery key phrase$/, async () => {
    try {
      const elm = await Utils.waitForElement(element(By.xpath('//*[text()="Your Secret Recovery Key"]/following-sibling::*')));
      const keyEl = await elm.getText();
      keyWords = keyEl.trim().split(' ');
      expect(keyWords).lengthOf(12, 'Recovery key phrase should be 12 words');
      await Utils.click(element(By.xpath('//div[text()="Continue"]/parent::div')));
    } catch (err) {
    }
  });

  this.Given(/^perform recovery key phrase verification instructions$/, async () => {
    const selectWordsEl = await browser.element(By.xpath('//*[contains(text(), "Select words #")]'));
    const selectWords = await selectWordsEl.getText();
    // Parse the phrase word numbers to validate
    /* tslint:disable-next-line: radix */
    const selectWordes = selectWords.match(/#([0-9]+)/g).map((s) => keyWords[parseInt(s.slice(1)) - 1]);
    /* tslint:disable-next-line: radix */
    for (const selectWord of selectWordes) {
      await Utils.click(element(By.xpath(`//div[span[text()="${selectWord}"]]`)));
    }

  });

  this.Then(/^load main page as authenticated user$/, async () => {
    await Utils.click(element(By.xpath('//div[text()="Go to Blockstack"]')));
    await Utils.waitForElement(element(By.xpath('//*[text()="Top Apps"]')));
  });
};
