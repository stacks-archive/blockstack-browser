import { createTestSelector } from '../utils';

export class DemoPageObject {
  url = 'http://localhost:3001';

  $openAuthButton = createTestSelector('button-open-connect-modal');

  async goToPage() {
    return page.goto(this.url, { waitUntil: 'domcontentloaded' });
  }
}
