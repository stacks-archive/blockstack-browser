import { BrowserDriver, setupBrowser } from './utils';
import { SECRET_KEY } from '../mocks';
import { WalletPage } from './page-objects/wallet.page';
import { ScreenPaths } from '@common/types';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Authentication integration tests`, () => {
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

  it('should be able to sign up from authentication page', async () => {
    await wallet.clickSignUp();
    await wallet.saveKey();
    await wallet.waitForHomePage();
    await wallet.goToSecretKey();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).not.toBeFalsy();
    expect(secretKey.split(' ').length).toEqual(24);
  });

  it('should be able to login from authentication page', async () => {
    await wallet.clickSignIn();
    await wallet.loginWithPreviousSecretKey(SECRET_KEY);
    await wallet.waitForHomePage();
    const secretKey = await wallet.getSecretKey();
    expect(secretKey).toEqual(SECRET_KEY);
  });
});
