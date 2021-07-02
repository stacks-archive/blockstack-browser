import { Page, BrowserContext } from 'playwright-core';
import { createTestSelector } from '../utils';

export class DemoPage {
  static url = 'http://localhost:3001';
  openConnectBtn = createTestSelector('sign-up');

  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static async init(context: BrowserContext) {
    const page = await context.newPage();
    await page.goto(this.url);
    return new this(page);
  }

  async openConnect() {
    return this.page.click(this.openConnectBtn, { timeout: 7000 });
  }
}
