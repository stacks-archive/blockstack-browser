const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');

let browserUrl = 'https://browser.blockstack.org';

const getTestBrowsers = () => {
  let browsers = ['firefox', 'chrome'];
  if (process.platform === 'darwin') {
    browsers.push('safari')
  }
  return new Set(browsers);
};

const getRandomInt = (min = 1000000000, max = 99999999999) => {
  return (Math.floor(Math.random() * (max - min)) + min);
}

const getRandomString = (length = 20) => {
  let str = '';
  do { str += Math.random().toString(36).substr(2) } while (str.length < length)
  return str.substr(0, length);
}

for (let browser of getTestBrowsers()) {
  describe(`account creation [${browser}]`, () => {

    let driver;

    before(() => {
      driver = new Builder().forBrowser(browser).build();
    })

    step('load initial page', async () => {
      await driver.get(browserUrl);
    });

    step('load create new ID page', async () => {
      if (process.env.BLOCKSTACK_REGISTRAR_API_KEY) {
        await driver.executeScript(`window.BLOCKSTACK_REGISTRAR_API_KEY = "${process.env.BLOCKSTACK_REGISTRAR_API_KEY}"`);
      } else {
        console.warn('No BLOCKSTACK_REGISTRAR_API_KEY env var has been set. Username registrations may fail due to IP blocking.')
      }
      await driver.findElement(By.xpath('//div[text()="Create new ID"]')).then(el => el.click());
    });

    let randomUsername
    step('enter unique username ', async () => {
      randomUsername = `e2e_test_${Date.now()/100000|0}_${getRandomInt(100000,999999)}`;
      await driver.findElement(By.css('input[type="text"][name="username"]')).then(el => el.sendKeys(randomUsername));
      await driver.findElement(By.xpath('//button[contains(., "Check Availability")]')).then(el => el.click());
      await driver.wait(until.elementLocated(By.xpath('//button[contains(., "Continue")]'))).then(el => el.click());
    });

    step('enter password', async () => {
      const randomPassword = getRandomString();
      await driver.findElement(By.css('input[type="password"][name="password"]')).then(el => el.sendKeys(randomPassword));
      await driver.findElement(By.css('input[type="password"][name="passwordConfirm"]')).then(el => el.sendKeys(randomPassword));
      await driver.wait(until.elementLocated(By.xpath('//button[contains(., "Register ID")]'))).then(el => el.click());
      await driver.wait(until.elementLocated(By.css('input[type="email"][name="email"]'))).then(el => el.sendKeys(`${randomUsername}@none.test`));
      await driver.findElement(By.xpath('//button[contains(., "Next")]')).then(el => el.click());
    });

    step('expect recovery email to fail', async () => {
      // Expect recovery email delivery to fail (the email domain does not exist)
      await driver.wait(until.elementLocated(By.xpath('//div[contains(., "Recovery email failed to send")]')));
      try {
        await driver.findElement(By.xpath('//*[text()="Username Registration Failed"]'));
        console.warn('Username Registration Failed - does test server IP need whitelisted on the registar?')
      } catch { }
    });

    let keyWords;
    step('get secret recovery key phrase', async () => {
      // First click redirects the page from /sign-up to /seed but doesn't change the form
      await driver.findElement(By.xpath('//div[text()="Secret Recovery Key"]/parent::div')).then(el => el.click());
      await driver.wait(until.elementLocated(By.xpath('//div[contains(., "Save your Secret Recovery")]')));
      await driver.findElement(By.xpath('//div[text()="Secret Recovery Key"]/parent::div')).then(el => el.click());

      // Get the recovery key phrase
      keyWords = await driver.wait(until.elementLocated(By.xpath('//*[text()="Your Secret Recovery Key"]/following-sibling::*'))).then(el => el.getText());
      console.log(`PHRASE: ${keyWords}`);
      keyWords = keyWords.trim().split(' ');
      expect(keyWords).lengthOf(12, 'Recovery key phrase should be 12 words');
      await driver.findElement(By.xpath('//div[text()="Continue"]/parent::div')).then(el => el.click());
    });

    step('perform recovery key phrase verification instructions', async () => {
      let selectWords = await driver.wait(until.elementLocated(By.xpath('//*[contains(text(), "Select words #")]'))).then(el => el.getText());
      console.log(`SELECT WORDS INSTRUCTIONS: ${selectWords}`);
      selectWords = selectWords.match(/#([0-9]+)/g).map(s => keyWords[parseInt(s.slice(1)) - 1]);
      for (let selectWord of selectWords) {
        await driver.findElement(By.xpath(`//div[span[text()="${selectWord}"]]`)).then(el => el.click());
      }
    });

    step('load main page as authenticated user', async () => {
      await driver.wait(until.elementLocated(By.xpath('//div[text()="Go to Blockstack"]'))).then(el => el.click())
      await driver.wait(until.elementLocated(By.xpath('//*[text()="User-ready Apps"]')))
    })

    after(async () => driver.quit());
  });
}