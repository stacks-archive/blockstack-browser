
const { WebDriver, By, until } = require('selenium-webdriver');
const fs = require('fs').promises;

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

  static waitElement(locator, tries = 3) {
    return Util.retry(() => driver.wait(until.elementLocated(locator)), tries);
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
    await fs.writeFile(filename, image, 'base64');
  }

}
