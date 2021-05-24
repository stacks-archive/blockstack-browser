import { ScreenPaths } from '@store/common/types';
import { Page } from 'playwright-core';
import { createTestSelector, wait, BrowserDriver } from '../utils';
import { USERNAMES_ENABLED } from '@common/constants';

export class WalletPage {
  static url = 'http://localhost:8081/index.html#';
  $signUpButton = createTestSelector('sign-up');
  $signInButton = createTestSelector('sign-in');
  $firstAccount = createTestSelector('account-index-0');
  homePage = createTestSelector('home-page');
  $textareaReadOnlySeedPhrase = `${createTestSelector('textarea-seed-phrase')}[data-loaded="true"]`;
  $buttonSignInKeyContinue = createTestSelector('sign-in-key-continue');
  setPasswordDone = createTestSelector('set-password-done');
  passwordInput = createTestSelector('set-password');
  setUsernameDone = createTestSelector('username-button');
  usernameInput = createTestSelector('username-input');
  saveKeyButton = createTestSelector('save-key');
  confirmSavedKey = createTestSelector('confirm-saved-key');
  eightCharactersErrMsg =
    'text="Your username should be at least 8 characters, with a maximum of 37 characters."';
  lowerCharactersErrMsg =
    'text="You can only use lowercase letters (a–z), numbers (0–9), and underscores (_)."';
  signInKeyError = createTestSelector('sign-in-seed-error');
  password = 'mysecretreallylongpassword';
  settingsButton = createTestSelector('menu-button');
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async getAuthPopup(browser: BrowserDriver) {
    const page = await this.recursiveGetAuthPopup(browser);
    if (!page) {
      await browser.context
        .pages()[0]
        .screenshot({ path: `tests/screenshots/no-auth-page-found.png` });
      throw new Error('Unable to get auth page popup');
    }
    const installPage = new this(page);
    return installPage;
  }

  /**
   * Due to flakiness of getting the pop-up page, this has some 'retry' logic
   */
  static async recursiveGetAuthPopup(browser: BrowserDriver, attempt = 1): Promise<Page> {
    const pages = browser.context.pages();
    const page = pages.find(p => p.url().startsWith('chrome-extension://'));
    if (!page) {
      if (attempt > 3) {
        throw new Error('Unable to get auth page popup');
      }
      await wait(250);
      return this.recursiveGetAuthPopup(browser, attempt + 1);
    }
    return page;
  }

  static async init(browser: BrowserDriver, path?: ScreenPaths) {
    const background = browser.context.backgroundPages()[0];
    const pageUrl: string = await background.evaluate(`openOptionsPage("${path || ''}")`);
    const page = await browser.context.newPage();
    await page.goto(pageUrl);
    page.on('pageerror', event => {
      console.log('Error in wallet:', event.message);
    });
    return new this(page);
  }

  async clickSignUp() {
    await this.page.click(this.$signUpButton);
  }

  async clickSignIn() {
    await this.page.click(this.$signInButton);
  }

  async waitForHomePage() {
    await this.page.waitForSelector(this.homePage, { timeout: 30000 });
  }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.enterSecretKey(secretKey);
    await this.enterPassword();
  }

  async enterSecretKey(secretKey: string) {
    await this.page.waitForSelector('textarea');
    await this.page.fill('textarea', secretKey);
    await this.page.click(this.$buttonSignInKeyContinue);
  }

  async getSecretKey() {
    await this.goToSecretKey();
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = await $secretKeyEl.textContent();
    if (!secretKey) throw 'No secret key content.';
    return secretKey;
  }

  async saveKey() {
    await this.page.click(this.confirmSavedKey);
    await this.enterPassword();
    await wait(1000);
  }

  async goTo(path: ScreenPaths) {
    await this.page.evaluate(`location.hash = '${path}'`);
  }

  async goToSecretKey() {
    await this.goTo(ScreenPaths.SETTINGS_KEY);
  }

  async enterPassword(password?: string) {
    await this.page.fill('input[type="password"]', password ?? this.password);
    await this.page.click(this.setPasswordDone);
  }

  async decryptRecoveryCode(password: string) {
    await this.page.fill('input[type="password"]', password);
    await this.page.click(createTestSelector('decrypt-recovery-button'));
  }

  async enterUsername(username: string) {
    if (USERNAMES_ENABLED) {
      await this.page.fill(this.usernameInput, username);
      await this.page.click(this.setUsernameDone);
    }
  }

  chooseAccount(username: string) {
    return this.page.click(`[data-test="account-${username}"]`);
  }

  /** Sign up with a randomly generated seed phrase */
  async signUp() {
    await this.clickSignUp();
    await this.saveKey();
    await this.waitForHomePage();
  }

  async openSettings() {
    return this.page.click(this.settingsButton);
  }
}
