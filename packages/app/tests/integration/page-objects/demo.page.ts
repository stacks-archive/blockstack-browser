import { Page } from 'playwright-core/lib/page';
import { BrowserContext } from 'playwright-core/lib/browserContext';
import { createTestSelector } from '../utils';

export class DemoPage {
  static url = 'http://localhost:3000';
  $openAuthButton = createTestSelector('button-skip-connect');
  authResponse = '#auth-response';
  appPriivateKey = '#app-private-key';
  getStarted = '//span[text()="Get Started"]';
  getStartedPopUp = 'css=button>span >> text="Get started"';
  skipBtn = 'text="Skip"';
  postTextarea = 'div.DraftEditor-root';
  postBtn = '//span[text()="Post"]';
  profileBtn = '//*[@title="Your Profile"]';
  logoutBtn = '//*[contains(text(),"Log out")]';
  alreadyHaveSecretKeyLink = '//span[text()="I already have a Secret Key"]';
  openConnectBtn = 'text="Open Connect"';
  openSignInBtn = 'text="Sign In"';

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
    return this.page.click(this.alreadyHaveSecretKeyLink);
  }

  async goToPage() {
    // return
  }

  async openConnect() {
    return this.page.click(this.openConnectBtn);
  }

  async waitForAuthResponse() {
    await this.page.waitForSelector('#auth-response');
    const authResponseEl = await this.page.$('#auth-response');
    const authResponse = (await this.page.evaluate(el => el?.getAttribute('value'), authResponseEl)) as string;
    return authResponse;
  }

  async clickConnectGetStarted() {
    return this.page.click(this.getStartedPopUp);
  }
}
