import {browser, ElementFinder, ExpectedConditions, WebElement} from 'protractor';

export class Utils {

  /**
   * Retries a given function until the given time has elapsed.
   * @param {(Promise<any>|(function():any)} func
   * @param {number} timeout - milliseconds to continue re-trying execution of a failing function.
   * @param {number} poll - milliseconds to wait before trying a failed function.
   */
  static async retry(func: any, timeout: number, poll: number): Promise<ElementFinder> {
    const startTime = Date.now();
    let lastErr;
    const hasTimeRemaining = () => (Date.now() - startTime < timeout);
    while (hasTimeRemaining()) {
      try {
        return await Promise.resolve(func());
      } catch (err) {
        lastErr = err;
        if (hasTimeRemaining()) {
          await browser.sleep(poll);
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

  static async getPlatform(): Promise<string> {
    const session = await browser.getSession();
    const platform = await session.getCapabilities().get("platform");
    return platform;
  }

  static async getSessionID(): Promise<string> {
    const session = await browser.getSession();
    return session.getId();
  }

  /**
   * This uses Selenium's `manage().logs()` API which is now only supported by Chrome's
   * WebDriver. Some remote WebDriver services (like BrowserStack) shim support for
   * this API on their end for some web browsers. Expect this to throw various kinds of
   * Errors, or silently failing with an empty result - depending on the environment and browser.
   */
  static async getBrowserLogs(): Promise<string> {
    const logEntries = await browser.manage().logs().get('browser');
    if (!logEntries) {
      throw new Error('Not supported - falsy `logs` object returned');
    }
    const logs = logEntries.map((entry) => {
      entry.toJSON();
    });
    const logJson = JSON.stringify(logs, null, 2);
    return logJson;
  }

  /**
   * @param {WebElement} element
   */
  static async scrollIntoView(targetElement: ElementFinder): Promise<void> {
    await browser.executeScript('arguments[0].scrollIntoView(true);', targetElement);
  }

  /**
   * Waits until the element is both located and visible, and scrolls the element into view.
   * @param {!(By|Function)} locator The locator to use.
   * @returns {Promise<WebElement>}
   */
  static async waitForElement(targetElement: ElementFinder, {timeout = 40000, poll = 200, driverWait = 2500} = {}): Promise<ElementFinder> {
    return this.retry(async () => {
      await browser.wait(ExpectedConditions.presenceOf(targetElement), driverWait);
      await browser.wait(ExpectedConditions.visibilityOf(targetElement), driverWait);
      await this.scrollIntoView(targetElement);
      return targetElement;
    }, timeout, poll);
  }

  /**
   * Loops with try/catch around the locator and click function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   */
  static async click(targetElement: ElementFinder, {timeout = 15000, poll = 200, driverWait = 2500} = {}): Promise<void> {
    const elm = await Utils.waitForElement(targetElement, {timeout, poll, driverWait});
    await elm.click();
  }

  /**
   * Loops with try/catch around the locator and click function for specified amount of tries.
   * @param {!(By|Function)} locator The locator to use.
   */
  static async sendKeys(targetElement: ElementFinder, value: string, {timeout = 15000, poll = 200, driverWait = 2500} = {}): Promise<void> {
    const elm = await Utils.waitForElement(targetElement, {timeout, poll, driverWait});
    await elm.sendKeys(value);
  }

  static async waitForElementToDisappear(targetElement: ElementFinder): Promise<void> {
    try {
      let isDisplayed = false;
      for (let i = 0; i < 500; i++) {
        await browser.sleep(2000);
        isDisplayed = await targetElement.isDisplayed();
        if (isDisplayed === false) {
          console.log("Spinner is displaying. : " + isDisplayed);
          return;
        }
      }
    } catch (error) {

    }
  }

  /**
   *
   * @param {string} script A javascript expression that evaluates to a promise.
   * @param {...any} args
   * @returns {any} The evaluated promise result, if any.
   */
  // tslint:disable-next-line: align
  static async executePromise(script, ...args) {
    const result = await browser.executeAsyncScript(`
            var callback = arguments[arguments.length - 1];
            ${script}
            .then(result => callback([result]))
            `, ...args);
    // tslint:disable-next-line: curly
    return result;
  }

  static async waitForElementToDisplayed(targetElement: ElementFinder): Promise<ElementFinder> {
    try {
      let isDisplayed = false;
      for (let i = 0; i < 500; i++) {
        await browser.sleep(2000);
        isDisplayed = await targetElement.isDisplayed();
        if (isDisplayed === true) {
          return;
        }
      }
    } catch (error) {

    }
  }
}
