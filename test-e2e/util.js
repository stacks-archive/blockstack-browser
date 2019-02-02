
const { WebDriver, By, until, WebElement } = require('selenium-webdriver');
const { promisify } = require('util');
const fs = require('fs');

/** @type {WebDriver} */
let driver;

module.exports = class Util {

  /**
   * @param {WebDriver} webDriver
   */
  static init(webDriver) {
    driver = webDriver;
  }

  /**
   * @param {Promise} func
   */
  static async retry(func, tries = 3) {
    for (let i = 0; i < tries; i++) {
      try {
        return await Promise.resolve(func());
      } catch (err) {
        if (i === tries - 1) {
          throw err;
        } else {
          console.warn(`Retrying after getting error: ${err}`);
          await driver.sleep(500);
        }
      }
    }
  }

  /**
   * @param {WebElement} element 
   */
  static async scrollIntoView(element) { 
    await driver.executeScript('arguments[0].scrollIntoView(true);', element);
  }

  /**
   * This callback is displayed as a global member.
   * @callback elementThenCallback
   * @param {WebElement} element
   */

  /**
   * Loops with try/catch around the locator function for specified amount of tries.
   * @param {elementThenCallback} then
   * @returns {Promise<WebElement>} 
   */
  static async waitElement(locator, then = undefined) {
    return await Util.retry(async () => {
      let el = await driver.wait(until.elementLocated(locator));
      await driver.wait(until.elementIsVisible(el));
      await Util.scrollIntoView(el);
      if (then) {
        await Promise.resolve(then(el));
      }
      return el;
    });
  }

  static getRandomInt(min = 1000000000, max = 99999999999) {
    return (Math.floor(Math.random() * (max - min)) + min);
  }

  static getRandomString(length = 20) {
    let str = '';
    do { str += Math.random().toString(36).substr(2) } while (str.length < length)
    return str.substr(0, length);
  }

  static async screenshot(filename = 'screenshot.png') {
    const image = await driver.takeScreenshot();
    await promisify(fs.writeFile)(filename, image, 'base64');
  }

}
