const { WebDriver, By, until, WebElement, logging } = require('selenium-webdriver');
const { promisify } = require('util');
const fs = require('fs');
const os = require('os');
const path = require('path');
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
   * 
   * @param {string} script A javascript expression that evaluates to a promise.
   * @param {...any} args
   * @returns {any} The evaluated promise result, if any.
   */
  async executePromise(script, ...args) {
    const [error, result] = await this.driver.executeAsyncScript(`
      var callback = arguments[arguments.length - 1];
      ${script}
        .then(result => callback([null, result]))
        .catch(error => callback([error.toString(), null]));
    `, ...args);
    if (error) {
      throw new Error(error);
    }
    return result;
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

  async getSessionID() {
    const session = await this.getSession();
    return session.getId();
  }

  /**
   * This uses Selenium's `manage().logs()` API which is now only supported by Chrome's
   * WebDriver. Some remote WebDriver services (like BrowserStack) shim support for
   * this API on their end for some web browsers. Expect this to throw various kinds of 
   * Errors, or silently failing with an empty result - depending on the environment and browser. 
   */
  async getBrowserLogs() {
    const logEntries = await this.driver.manage().logs().get(logging.Type.BROWSER);
    if (!logEntries) {
      throw new Error('Not supported - falsy `logs` object returned');
    }
    const logs = logEntries.map(entry => entry.toJSON());
    const logJson = JSON.stringify(logs, null, 2);
    return logJson;
  }

  /**
   * Loops with try/catch around the locator function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   * @param {string} text The string of keys to send.
   * @param {boolean} validateValue 
   * If true then the element's value will be checked after a short wait to ensure it was set. 
   * If validation fails it will attempted one more time. 
   * @returns {Promise<WebElement>} 
   */
  async setText(locator, text, validateValue = false) {
    const platform = await this.getPlatform();
    let element;
    if (platform !== 'iOS') {
      element = await this.el(locator, async (el) => {
        await el.clear();
        await el.sendKeys(text); 
      });
    } else { 
      // Bug on iOS devices with selenium/appium & react
      // See: https://github.com/facebook/react/issues/11488#issuecomment-347775628
      // Updated to use less hacky workaround from cypress:
      // See: https://github.com/cypress-io/cypress/pull/732/files#diff-ed17d49edc10403752ba3d786a7512dbR34
      element = await this.el(locator, async (el) => {
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
      `, el, text);
      });
    }

    if (validateValue) {
      try {
        await this.sleep(200);
        let actualVal = '';
        const elCheck = await this.el(locator, async (el) => {
          actualVal = await this.executeScript(`return arguments[0].value;`, el);
        });
        if (actualVal !== text) {
          console.warn(`setText value validation failed - expected '${text}' but value is '${actualVal}'. Retrying once more...`);
          try {
            await elCheck.clear();
          } catch (error) {
            console.warn(`Ignoring error trying to clear element value before retrying: ${error}`);
          }
          return await this.setText(locator, text);
        }
      } catch (error) {
        console.error(`Error validating setText value: ${error}`);
        throw error;
      }
    }

    return element;
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

  /**
   * @param {!(By|Function)} locator The locator to use.
   */
  async elementExists(locator) {
    const matches = await this.findElements(locator);
    return matches.length > 0;
  }

    /**
   * @param {!(By|Function)} locator The locator to use.
   */
  async elementNotExists(locator) {
    const matches = await this.findElements(locator);
    return matches.length > 0;
  }

  async screenshot(filename = '') {
    if (!filename) {
      filename = `screenshot-${Date.now()/1000|0}-${helpers.getRandomString(6)}.png`
      filename = path.resolve(os.tmpdir(), filename);
    }
    const image = await this.driver.takeScreenshot();
    await promisify(fs.writeFile)(filename, image, 'base64');
    return filename;
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
