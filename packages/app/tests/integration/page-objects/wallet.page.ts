import { ScreenPaths } from '@store/onboarding/types';
import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector, wait } from '../utils';

export class WalletPage {
  static url = 'http://localhost:8081/index.html#';
  $signUpButton = createTestSelector('sign-up');
  $signInButton = createTestSelector('sign-in');
  $firstAccount = createTestSelector('account-index-0');
  $finishedPage = createTestSelector('install-finished');
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
  password = 'mysecretpassword';
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async getAuthPopup(context: BrowserContext) {
    const page = await this.recursiveGetAuthPopup(context);
    if (!page) {
      await context.pages()[0].screenshot({ path: `tests/screenshots/no-auth-page-found.png` });
      throw new Error('Unable to get auth page popup');
    }
    const installPage = new this(page);
    return installPage;
  }

  /**
   * Due to flakiness of getting the pop-up page, this has some 'retry' logic
   */
  static async recursiveGetAuthPopup(context: BrowserContext, attempt = 1): Promise<Page> {
    const pages = context.pages();
    const page = pages.find(p => p.url().includes(this.url));
    if (!page) {
      if (attempt > 3) {
        throw new Error('Unable to get auth page popup');
      }
      await wait(50);
      return this.recursiveGetAuthPopup(context, attempt + 1);
    }
    return page;
  }

  static async init(context: BrowserContext, path?: ScreenPaths) {
    const page = await context.newPage();
    await page.goto(`${this.url}${path || ''}`);
    return new this(page);
  }

  async clickSignUp() {
    await this.page.click(this.$signUpButton);
  }

  async clickSignIn() {
    await this.page.click(this.$signInButton);
  }

  async waitForFinishedPage() {
    await this.page.waitForSelector(this.$finishedPage, { timeout: 5000 });
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
    const secretKey = (await this.page.$eval(
      this.$textareaReadOnlySeedPhrase,
      (el: HTMLTextAreaElement) => el.value
    )) as string;
    return secretKey;
  }

  async saveKey() {
    await this.page.click(this.saveKeyButton);
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

  async enterPassword() {
    await this.page.fill('input[type="password"]', this.password);
    await this.page.click(this.setPasswordDone);
  }

  async decryptRecoveryCode(password: string) {
    await this.page.fill('input[type="password"]', password);
    await this.page.click(createTestSelector('decrypt-recovery-button'));
  }

  async enterUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
    await this.page.click(this.setUsernameDone);
  }

  chooseAccount(username: string) {
    return this.page.click(`[data-test="account-${username}"]`);
  }
}
