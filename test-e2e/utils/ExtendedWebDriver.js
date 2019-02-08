const { WebDriver, By, until, WebElement } = require('selenium-webdriver');
const { promisify } = require('util');
const fs = require('fs');
const helpers = require('./helpers');

/**
 * Adds helper methods to a WebDriver instance. 
 * This includes some fairly typical boilerplate code
 * for performing try/catch/retry techniques for reducing 
 * selenium flakiness - see http://lmgtfy.com/?q=selenium+flakiness
 */
class ExtendedWebDriver extends WebDriver {

  /**
   * Uses a mixin pattern to merge the methods of a given WebDriver instance with
   * this class instance. 
   * @param {WebDriver} webDriver
   */
  constructor(driver) {
    super(null, null);
    this.driver = driver;

    // Merge functions from the given WebDriver instance into this instance.
    helpers.mixin(this, driver);
  }

  /**
   * Retries a given function until the given time has elapsed. 
   * @param {(Promise<any>|(function():any)} func
   * @param {number} timeout - milliseconds to continue re-trying execution of a failing function.
   * @param {number} poll - milliseconds to wait before trying a failed function.
   */
  async retry(func, timeout, poll) {
    const startTime = Date.now();
    let lastErr;
    const hasTimeRemaining = () => (Date.now() - startTime < timeout);
    while (hasTimeRemaining()) {
      try {
        return await Promise.resolve(func());
      } catch (err) {
        lastErr = err;
        if (hasTimeRemaining()) {
          await this.driver.sleep(poll);
          if (hasTimeRemaining()) {
            console.warn(`Retrying after getting error: ${err}`);
            continue;
          }
        }
        break;
      }
    }
    console.error(`Error after timeout period has elapsed.`);
    throw lastErr;
  }

  async getPlatform() {
    if (this.platform) {
      return this.platform;
    }
    const session = await this.getSession();
    const platform = session.getCapabilities().getPlatform();
    this.platform = platform;
    return platform;
  }

  /**
   * Loops with try/catch around the locator function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   * @param {string} text The string of keys to send
   * @returns {Promise<WebElement>} 
   */
  async sendKeys(locator, text) {
    const platform = await this.getPlatform();
    if (platform !== 'iOS') {
      await this.el(locator, el => el.sendKeys(text));
    } else { 
      // Bug on iOS devices with selenium/appium & react
      // See: https://github.com/facebook/react/issues/11488#issuecomment-347775628
      // Updated to use less hacky workaround from cypress:
      // See: https://github.com/cypress-io/cypress/pull/732/files#diff-ed17d49edc10403752ba3d786a7512dbR34
      const element = await this.el(locator);
      await this.executeScript(`
        let input = arguments[0];
        if (input.tagName === "INPUT") {
          let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
          valueSetter.call(input, arguments[1]);
        } else { 
          let valueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
          valueSetter.call(input, arguments[1]);
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
      `, element, text);
    }
  }

  /**
   * @param {WebElement} element 
   */
  async scrollIntoView(element) {
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * @callback elementThenCallback
   * @param {WebElement} element
   */

  /**
   * Loops with try/catch around the locator function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   * @param {elementThenCallback} then
   * @returns {Promise<WebElement>} 
   */
  async el(locator, then = undefined, { timeout = 15000, poll = 200, driverWait = 2500 } = {}) {
    return await this.retry(async () => {
      let el = await this.driver.wait(until.elementLocated(locator), driverWait);
      await this.driver.wait(until.elementIsVisible(el), driverWait);
      await this.scrollIntoView(el);
      if (then) {
        await Promise.resolve(then(el));
      }
      return el;
    }, timeout, poll);
  }

  /**
   * Loops with try/catch around the locator and click function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   * @returns {Promise<WebElement>} 
   */
  async click(locator, { timeout = 15000, poll = 200, driverWait = 2500 } = {}) {
    return await this.el(locator, el => el.click(), { timeout, poll, driverWait });
  }

  async screenshot(filename = 'screenshot.png') {
    const image = await this.driver.takeScreenshot();
    await promisify(fs.writeFile)(filename, image, 'base64');
  }

  /**
   * @param {string} url 
   */
  async get(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.driver.get(url);
        return;
      } catch (err) {
        if (i === retries - 1) {
          console.error(`Error loading initial page: ${err}`)
          throw err;
        }
        await this.driver.sleep(200);
        console.warn('Retrying after error loading initial page...');
      }
    }
  }
}

module.exports = ExtendedWebDriver;
