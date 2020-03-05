import { Page } from 'playwright-core/lib/page';
import { createTestSelector, wait, Browser } from '../utils';

export class AuthPage {
  static url = 'http://localhost:8080';
  page: Page;
  $buttonCopySecretKey = createTestSelector('button-copy-secret-key');
  $buttonHasSavedSeedPhrase = createTestSelector('button-has-saved-seed-phrase');
  $inputUsername = createTestSelector('input-username');
  $buttonUsernameContinue = createTestSelector('button-username-continue');
  $textareaReadOnlySeedPhrase = createTestSelector('textarea-seed-phrase');
  $buttonConfirmReenterSeedPhrase = createTestSelector('button-confirm-reenter-seed-phrase');
  $textareaSeedPhraseInput = createTestSelector('textarea-reinput-seed-phrase');
  $buttonConnectFlowFinished = createTestSelector('button-connect-flow-finished');
  $firstAccount = createTestSelector('account-index-0');
  onboardingSignIn = '#onboarding-sign-in';
  eightCharactersErrMsg = 'text="Your username should be at least 8 characters, with a maximum of 37 characters."';
  lowerCharactersErrMsg = 'text="You can only use lowercase letters (a–z), numbers (0–9), and underscores (_)."';
  iHaveSavedIt = 'text="I\'ve saved it"';
  passwordInput = '//input[@type="password"]';
  addNewAccountLink = '//span[text()="Add a new account"]';
  invalidSecretKey = 'text="The Secret Key you\'ve entered is invalid"';
  incorrectPassword = 'text="Incorrect password"';

  continueBtn = 'text="Continue"';

  constructor(page: Page) {
    this.page = page;
  }

  static async getAuthPage(browser: Browser, signUp = true) {
    const page = await this.recursiveGetAuthPage(browser);
    if (!page) {
      throw new Error('Unable to get auth page popup');
    }
    const authPage = new this(page);
    await page.waitForSelector(createTestSelector('screen'));
    if (signUp) {
      await page.waitFor(authPage.$textareaReadOnlySeedPhrase, { timeout: 15000 });
    }
    return authPage;
  }

  /**
   * Due to flakiness of getting the pop-up page, this has some 'retry' logic
   */
  static async recursiveGetAuthPage(browser: Browser, attempt = 1): Promise<Page> {
    const page = (await browser.contexts()[0].pages())[1];
    if (!page) {
      if (attempt > 3) {
        throw new Error('Unable to get auth page popup');
      }
      await wait(50);
      return this.recursiveGetAuthPage(browser, attempt + 1);
    }
    return page;
  }

  async saveSecretPhrase() {
    await this.page.waitForSelector(this.$textareaReadOnlySeedPhrase);
    const $secretKeyEl = await this.page.$(this.$textareaReadOnlySeedPhrase);
    if (!$secretKeyEl) {
      throw 'Could not find secret key field';
    }
    const secretKey = (await this.page.evaluate(el => el.textContent, $secretKeyEl)) as string;
    // const secretKey = (await this.page.$eval(this.$textareaReadOnlySeedPhrase, element => element.value)) as string;
    await this.page.click(this.$buttonCopySecretKey);
    await this.page.waitForSelector(this.$buttonHasSavedSeedPhrase);
    await this.page.click(this.$buttonHasSavedSeedPhrase);
    return secretKey;
  }

  async setUserName(text: string) {
    await this.page.waitForSelector(this.$inputUsername);
    await this.page.type(this.$inputUsername, text);
    await this.page.click(this.$buttonUsernameContinue);
  }

  async screenshot(name = 'screenshot') {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }

  async loginWithPreviousCreatedUser(text: string) {
    await this.page.click(`//span[text()="${text}"]`);
  }

  // async createNewAccount(username: string) {
  //   await this.page.click(this.addNewAccountLink);
  //   await this.setUserName(username);
  // }

  async loginWithPreviousSecretKey(secretKey: string) {
    await this.page.type('textarea', secretKey);
    await this.page.click(this.continueBtn);
  }

  async setPassword(password: string) {
    await this.page.type(this.passwordInput, password);
    await this.page.click(this.continueBtn);
  }

  async chooseAccount(username: string) {
    return this.page.click(`text="${username}"`);
  }

  async clickIHaveSavedIt() {
    let error;
    await this.page.waitForSelector(this.iHaveSavedIt, { timeout: 3000 }).catch(e => (error = e));
    if (error == null) {
      await this.page.click(this.iHaveSavedIt);
    }
  }
}
