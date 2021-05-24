import { BrowserDriver, createTestSelector, randomString, setupBrowser } from './utils';
import { SECRET_KEY } from '../mocks';
import { WalletPage } from './page-objects/wallet.page';
import { ScreenPaths } from '@store/common/types';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);
describe(`Installation integration tests`, () => {
  let browser: BrowserDriver;
  let installPage: WalletPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    installPage = await WalletPage.init(browser, ScreenPaths.INSTALLED);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to sign up from installation page', async () => {
    await installPage.clickSignUp();
    await installPage.saveKey();
    await installPage.waitForHomePage();
    await installPage.goToSecretKey();
    const secretKey = await installPage.getSecretKey();
    expect(secretKey).not.toBeFalsy();
    expect(secretKey.split(' ').length).toEqual(24);
  });

  it('should be able to login from installation page', async () => {
    await installPage.clickSignIn();
    await installPage.loginWithPreviousSecretKey(SECRET_KEY);
    await installPage.waitForHomePage();
    const secretKey = await installPage.getSecretKey();
    expect(secretKey).toEqual(SECRET_KEY);
  });

  it('should be able to sign up, restore, lock and unlock the extension', async () => {
    await installPage.clickSignUp();
    await installPage.saveKey();
    await installPage.waitForHomePage();
    await installPage.goToSecretKey();
    const secretKey = await installPage.getSecretKey();
    await installPage.openSettings();
    await installPage.page.click(createTestSelector('settings-sign-out'));

    await installPage.clickSignIn();
    await installPage.enterSecretKey(secretKey);
    const password = randomString(15);
    await installPage.enterPassword(password);
    await installPage.openSettings();
    await installPage.page.click(createTestSelector('settings-lock'));
    await installPage.enterPassword(password);
    await installPage.goToSecretKey();
    const decryptedSecretKey = await installPage.getSecretKey();
    expect(decryptedSecretKey).toEqual(secretKey);
  });
});
