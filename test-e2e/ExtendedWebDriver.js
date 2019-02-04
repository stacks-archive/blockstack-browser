const { WebDriver, By, until, WebElement } = require('selenium-webdriver');
const { promisify } = require('util');
const fs = require('fs');

module.exports = class ExtendedWebDriver extends WebDriver {

  /**
   * @param {WebDriver} webDriver
   */
  constructor(driver) {
    super(null, null);
    this.driver = driver;

    const extendedProps = Object.getOwnPropertyNames(ExtendedWebDriver.prototype);
    const defaultProps = Object.getOwnPropertyNames(WebDriver.prototype);
    for (const prop of defaultProps) {
      if (!extendedProps.includes(prop) && typeof driver[prop] === 'function') {
        Object.defineProperty(this, prop, { value: driver[prop].bind(driver) });
      }
    }
  }

  /**
   * @param {Promise} func
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

  /**
   * @param {WebElement} element 
   */
  async scrollIntoView(element) {
    await this.driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * This callback is displayed as a global member.
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
