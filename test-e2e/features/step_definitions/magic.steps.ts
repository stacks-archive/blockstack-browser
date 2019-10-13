import {browser, By, element} from 'protractor';
import {SampleAccount} from '../../src/utils/sample-account';
import {Utils} from '../../src/utils/Utils';

module.exports = function MagicAccount() {

  this.Given(/^load sign in page$/, async () => {
    await Utils.click(element(By.xpath('//a[contains(.,"Sign in with an existing ID")]')));
  });

  this.Then(/^enter secret recovery key$/, async () => {
    await Utils.sendKeys(element(By.css('textarea[name="recoveryKey"]')), SampleAccount.SECRET_RECOVERY_KEY);
    await Utils.click(element(By.css('button[type="submit"]')));
  });

  this.Then(/^enter blockstack password$/, async () => {
    await Utils.sendKeys(element(By.css('input[name="password"]')), SampleAccount.PASSWORD);
    await Utils.sendKeys(element(By.css('input[name="passwordConfirm"]')), SampleAccount.PASSWORD);
    await Utils.click(element(By.css('button[type="submit"]')));
  });

  this.Then(/^wait for Loading spinner$/, async () => {
    await Utils.waitForElement(element(By.xpath('//*[contains(text(), "Loading")]')));
    await Utils.waitForElementToDisappear(element(By.xpath('//*[contains(text(), "Loading")]')));
    // wait for next page to load
    await Utils.waitForElement(element(By.xpath('//*[contains(text(), "What is your email")]')));
  });

  this.Given(/^enter blockstack email$/, async () => {
    await Utils.sendKeys(element(By.css('input[name="email"]')), SampleAccount.EMAIL);
    await Utils.click(element(By.css('button[type="submit"]')));
  });

  this.Then(/^wait for Restoring your Blockstack ID$/, async () => {
    // await Utils.waitForElement(element(By.xpath('//*[contains(text(), "Restoring your Blockstack ID")]')));
    await Utils.waitForElementToDisappear(element(By.xpath('//*[contains(text(), "Restoring your Blockstack ID")]')));
    // wait for next page to load
    await Utils.waitForElement(element(By.xpath('//*[contains(.,"Go to Blockstack")]')));
  });

  this.Then(/^load main page for authenticated user$/, async () => {
    await Utils.click(element(By.css('div[class^="button__Label"]')));
    // await Utils.click(element(By.cssContainingText('div[class^="button__Label"]', 'Go to Blockstack')));
    await browser.sleep(2999);
    await Utils.waitForElement(element(By.xpath('//*[text()="Top Apps"]')));
  });
};
