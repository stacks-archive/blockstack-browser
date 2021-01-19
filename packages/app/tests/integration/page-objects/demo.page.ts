import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector } from '../utils';

export class DemoPage {
  static url = 'http://localhost:3001';
  $openAuthButton = createTestSelector('button-skip-connect');
  authResponse = '#auth-response';
  appPriivateKey = '#app-private-key';
  getStarted = '//span[text()="Get your Secret Key"]';
  getStartedPopUp = 'css=button>span >> text="Get your Secret Key"';
  skipBtn = 'text="Skip"';
  postTextarea = 'div.DraftEditor-root';
  postBtn = '//span[text()="Post"]';
  profileBtn = '//*[@title="Your Profile"]';
  logoutBtn = '//*[contains(text(),"Log out")]';
  alreadyHaveSecretKeyLink = '//span[text()="Sign in"]';
  openConnectBtn = createTestSelector('sign-up');
  openSignInBtn = createTestSelector('sign-in');

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  // /**
  //  * Explicitly set the return type here to prevent the primitive being lost when using new
  //  * @return {Page} from 'playwright-core/lib/page';
  //  */
  async clickAlreadyHaveSecretKey() {
    const modal = await this.page.waitForSelector('connect-modal', { state: 'attached' });
    await modal.dispatchEvent('onSignIn');
  }

  async goToPage() {
    // return
  }

  openConnect() {
    return this.page.click(this.openConnectBtn, { timeout: 7000 });
  }

  async screenshot(name = 'screenshot') {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }

  async waitForAuthResponse() {
    await this.page.waitForSelector('#auth-response', { state: 'attached', timeout: 15000 });
    const authResponseEl = await this.page.$('#auth-response');
    const authResponse = (await this.page.evaluate(
      el => el?.getAttribute('value'),
      authResponseEl
    )) as string;
    return authResponse;
  }

  async clickConnectGetStarted() {
    const modal = await this.page.waitForSelector('connect-modal', { state: 'attached' });
    await modal.dispatchEvent('onSignUp');
  }
}
