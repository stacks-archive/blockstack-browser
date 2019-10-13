const {Local: BrowserStackLocal} = require('browserstack-local');
const browserstack = require("browserstack-local");
import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import {createServer, IncomingMessage, ServerResponse} from 'http';
import {browser, By, element, utils} from 'protractor';
import * as url from 'url';
import {Utils} from '../../src/utils/Utils';

const {createServer: createHttpServer, Server: HttpServer} = require('http');
const serveHandler = require('serve-handler');


chai.use(chaiAsPromised);
const expect = chai.expect;

module.exports = function myStepDefinitions() {
// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

  let staticWebServer;
  let randomUsername;

  this.Before(async () => {
    await browser.waitForAngularEnabled(false);
    if (browser.params.serveDirectory) {
      console.log(`Starting static web server for a directory to host the Browser locally...`)
      staticWebServer = createHttpServer((req, res) => {
        return serveHandler(req, res, {
          public: browser.params.serveDirectory,
          rewrites: [{source: '**', destination: '/index.html'}]
        });
      });
      await new Promise((resolve, reject) => {
        staticWebServer.unref();
        staticWebServer.listen(url.parse(browser.params.browserHostUrl).port, error => {
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
  });

  this.After(async () => {
    try {
      await browser.manage().deleteAllCookies();
    } catch (e) {
      console.log("Cookies are not deleted.");
    }
    await browser.get(browser.params.browserHostUrl);
    await browser.executeScript('window.sessionStorage.clear();');
    await browser.executeScript('window.localStorage.clear();');

    if (staticWebServer && staticWebServer.listening) {
      console.log(`Stopping static web server`);
      // Check if a local web server needs to be shutdown
      if (staticWebServer && staticWebServer.listening) {
        await new Promise((resolve) => {
          staticWebServer.close((error) => {
            if (error) {
              console.error(`Error stopping local static web server: ${error}`);
            }
            resolve();
          });
        });
      }
    }
  });

  this.Given(/^load initial page$/, async () => {
    await browser.get("https://google.com");
    await browser.get(browser.params.browserHostUrl);
    await Utils.waitForElementToDisplayed(element(By.xpath('//*[contains(.,"Create your Blockstack ID")]')));
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
    // await Utils.waitForElement(element(By.xpath('//*[contains(text(), "Creating your Blockstack ID")]')));
    await browser.sleep(1999);
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
    } catch (err) {
      console.warn(`Error checking for "Unlocking Recovery Key" spinner: ${err}`);
    }
    await Utils.waitForElement(element(By.xpath('//*[text()="Your Secret Recovery Key"]/following-sibling::*')),
      { timeout: 90000, poll: 200, driverWait: 90000 });
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
