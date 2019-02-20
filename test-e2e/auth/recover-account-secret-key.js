const { By, until } = require('selenium-webdriver');
const createTestSuites = require('../utils/create-test-suites');
const SAMPLE_ACCOUNT = require('./sample-account');

createTestSuites('account recovery via secret key', ({driver, browserHostUrl }) => {

  step('load initial page', async () => {
    await driver.get(browserHostUrl);
    await driver.el(By.xpath('//*[contains(.,"Create your Blockstack ID")]'));
  });

  step('load sign in page', async () => {
    await driver.click(By.xpath('//a[contains(.,"Sign in with an existing ID")]'));
  });

  step('enter secret recovery key', async () => {
    await driver.setText(By.css('textarea[name="recoveryKey"]'), SAMPLE_ACCOUNT.SECRET_RECOVERY_KEY);
    await driver.click(By.css('button[type="submit"]'));
  });

  step('create password', async () => {
    await driver.setText(By.css('input[name="password"]'), SAMPLE_ACCOUNT.PASSWORD);
    await driver.setText(By.css('input[name="passwordConfirm"]'), SAMPLE_ACCOUNT.PASSWORD);
    await driver.click(By.css('button[type="submit"]'));
  });

  step('enter email', async () => {
    await driver.setText(By.css('input[name="email"]'), SAMPLE_ACCOUNT.EMAIL);
    await driver.click(By.css('button[type="submit"]'));
  });

  step('wait for "Restoring your Blockstack ID"', async () => {
    try {
      // first check if message is still showing (it may have been quick and already closed)
      await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Restoring your Blockstack ID")]')), 2500);
    } catch (err) {
      console.warn(`Ignoring error checking for "Restoring your Blockstack ID" spinner: ${err}`);
    }
    // wait for next page to load
    await driver.el(By.xpath('//*[contains(.,"Go to Blockstack")]'), null,
      { timeout: 150000, poll: 200, driverWait: 150000 });
  });

  step('load main page as authenticated user', async () => {
    // This doesn't work on mobile (appium) - no idea why..
    // await driver.click(By.xpath('//div[text()="Go to Blockstack"]'));
    await driver.executeScript(`
      var elements = document.getElementsByTagName("div");
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].innerText == "Go to Blockstack") {
          elements[i].click();
          return;
        }
      }
      throw new Error("not found");
    `);

    await driver.el(By.xpath('//*[text()="Popular Apps"]'));
  });

});
