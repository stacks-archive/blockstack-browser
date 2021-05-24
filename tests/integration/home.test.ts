import { BrowserDriver, createTestSelector, setupBrowser } from './utils';
import { WalletPage } from './page-objects/wallet.page';
import { ScreenPaths } from '@store/common/types';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);
describe(`Installation integration tests`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, ScreenPaths.INSTALLED);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to create a new account', async () => {
    await wallet.signUp();
    await wallet.page.click(wallet.settingsButton);
    await wallet.page.click(createTestSelector('settings-create-an-account'));
    await wallet.page.click(createTestSelector('create-account-done-button'));
    const displayName = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName).toEqual('Account 2');
  });
});
