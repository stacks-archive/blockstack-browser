import { Page } from 'playwright-core';
import { BrowserContext } from 'playwright-core';
import { createTestSelector, Browser } from '../utils';

export class DemoPage {
  static url = 'http://localhost:3000';
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
  clickAlreadyHaveSecretKey() {
    return this.page.click(this.alreadyHaveSecretKeyLink);
  }

  async goToPage() {
    // return
  }

  openConnect() {
    return this.page.click(this.openConnectBtn);
  }

  async screenshot(name = 'screenshot') {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }

  async waitForAuthResponse(browser: Browser) {
    try {
      await this.page.waitForSelector('#auth-response', { state: 'attached', timeout: 15000 });
      const authResponseEl = await this.page.$('#auth-response');
      const authResponse = (await this.page.evaluate(
        el => el?.getAttribute('value'),
        authResponseEl
      )) as string;
      return authResponse;
    } catch (error) {
      browser
        .contexts()[0]
        .pages()
        .forEach(page => {
          console.log(page.url());
        });
      const newPage = browser
        .contexts()[0]
        .pages()
        .find(page => {
          return page.url().includes('authResponse=');
        });
      if (newPage) {
        this.page = newPage;
        const authResponse = this.page.url().split('=')[1];
        return authResponse;
      } else {
        await this.screenshot(`failed-auth-response-${new Date().getTime()}.png`);
        throw new Error('Unable to find auth response');
      }
    }
  }

  clickConnectGetStarted() {
    return this.page.click(this.getStartedPopUp);
  }
}
