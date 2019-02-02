const { WebDriver, Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const path = require('path');
const { getTestEnvironments } = require('./test-env');
const util = require('./util');
const { retry, waitElement, screenshot, getRandomInt, getRandomString } = util;

// selenium-webdriver docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver.html

// TODO: this needs configurably target a local instance
let browserUrl = 'https://browser.blockstack.org';

for (const testEnvironment of getTestEnvironments()) {

  describe(`account creation [${testEnvironment.description}]`, () => {

    /** @type {WebDriver} */
    let driver;

    step('create selenium webdriver', async () => {
      driver = await testEnvironment.createDriver();
      util.init(driver);
    })

    step('load initial page', async () => {
      await driver.get(browserUrl);
    });

    step('load create new ID page', async () => {
      //if (process.env.BLOCKSTACK_REGISTRAR_API_KEY) {
      //  await driver.executeScript(`window.BLOCKSTACK_REGISTRAR_API_KEY = "${process.env.BLOCKSTACK_REGISTRAR_API_KEY}"`);
      //} else {
      //  console.warn('No BLOCKSTACK_REGISTRAR_API_KEY env var has been set. Username registrations may fail due to IP blocking.')
      //} 
      await waitElement(By.xpath('//div[text()="Create new ID"]'), el => el.click());
    });

    let randomUsername
    step('enter unique username ', async () => {
      randomUsername = `test_e2e_${Date.now()/100000|0}_${getRandomInt(100000,999999)}`;
      await waitElement(By.css('input[type="text"][name="username"]'), el => el.sendKeys(randomUsername));
      await waitElement(By.xpath('//button[contains(., "Check Availability")]'), el => el.click());
      await waitElement(By.xpath('//button[contains(., "Continue")]'), el => el.click());
    });

    step('enter password', async () => {
      const randomPassword = getRandomString();
      await waitElement(By.css('input[type="password"][name="password"]'), el => el.sendKeys(randomPassword));
      await waitElement(By.css('input[type="password"][name="passwordConfirm"]'), el => el.sendKeys(randomPassword));
      await waitElement(By.xpath('//button[contains(., "Register ID")]'), el => el.click());
      await waitElement(By.css('input[type="email"][name="email"]'), el => el.sendKeys(`${randomUsername}@none.test`));
      await waitElement(By.xpath('//button[contains(., "Next")]'), el => el.click());
    });

    step('expect recovery email to fail', async () => {
      // Expect recovery email delivery to fail (the email domain does not exist)
      await waitElement(By.xpath('//div[contains(., "Recovery email failed to send")]'));
      try {
        const el = await waitElement(By.xpath('//*[text()="Username Registration Failed"]'));
        console.warn('Username Registration Failed - does test server IP need whitelisted on the registar?')
        // close the alert since it can eclipse the continuation button..
        el.findElement(By.xpath('parent::div/following-sibling::div/descendant::span')).then(el => el.click());
        await driver.wait(until.elementIsNotVisible(el));
      } catch { }
    });

    step('acknowledge saving recovery key phrase', async () => {
      // First click redirects the page from /sign-up to /seed but doesn't change the form
      await waitElement(By.xpath('//div[text()="Secret Recovery Key"]/parent::div'), el => el.click());
      await waitElement(By.xpath('//div[contains(., "Save your Secret Recovery")]'));
      await waitElement(By.xpath('//div[text()="Secret Recovery Key"]/parent::div'), el => el.click());
    });

    let keyWords;
    step('get secret recovery key phrase', async () => {
      // Get the recovery key phrase
      const keyEl = await waitElement(By.xpath('//*[text()="Your Secret Recovery Key"]/following-sibling::*'));
      keyWords = await keyEl.getText();
      keyWords = keyWords.trim().split(' ');
      expect(keyWords).lengthOf(12, 'Recovery key phrase should be 12 words');
      await waitElement(By.xpath('//div[text()="Continue"]/parent::div'), el => el.click());
    });

    step('perform recovery key phrase verification instructions', async () => {
      const selectWordsEl = await waitElement(By.xpath('//*[contains(text(), "Select words #")]'));
      let selectWords = await selectWordsEl.getText();
      // Parse the phrase word numbers to validate
      selectWords = selectWords.match(/#([0-9]+)/g).map(s => keyWords[parseInt(s.slice(1)) - 1]);
      for (let selectWord of selectWords) {
        await waitElement(By.xpath(`//div[span[text()="${selectWord}"]]`), el => el.click());
      }
    });

    step('load main page as authenticated user', async () => {
      await waitElement(By.xpath('//div[text()="Go to Blockstack"]'), el => el.click())
      await waitElement(By.xpath('//*[text()="User-ready Apps"]'))
    });

    afterEach(function() {
      if (this.currentTest.state === 'failed') {
        const screenshotFile = path.resolve(`screenshot-failed-${getRandomString()}.png`);
        return screenshot(screenshotFile).then(() => {
          console.log(`screenshot for failure saved to ${screenshotFile}`);
        });
      }
    });

    after(async () => {
      await driver.quit();
    });

  });
}
