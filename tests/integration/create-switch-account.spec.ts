import { BrowserDriver, createTestSelector, setupBrowser } from './utils';
import { WalletPage } from './page-objects/wallet.page';
import { ScreenPaths } from '@common/types';
import { SettingsSelectors } from './settings.selectors';

jest.setTimeout(40_000);
jest.retryTimes(process.env.CI ? 2 : 0);
describe(`Create and switch account`, () => {
  const COUNT = 3;
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

  it('should be able to create a new account then switch', async () => {
    await wallet.signUp();
    await wallet.clickSettingsButton();
    await wallet.page.click(wallet.$createAccountButton);
    await wallet.page.waitForSelector(wallet.$createAccountDone);
    await wallet.page.click(wallet.$createAccountDone);
    const displayName = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName).toEqual('Account 2');
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
    await wallet.page.click(createTestSelector('switch-account-item-0'));
    await wallet.page.waitForSelector(createTestSelector('account-checked-1'), {state: 'hidden'})
    const displayName2 = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName2).toEqual('Account 1');
  });

  it(`should be able to create ${COUNT} new accounts then switch between them`, async () => {
    await wallet.signUp();
    for (let i = 0; i < COUNT - 1; i++) {
      await wallet.clickSettingsButton();
      await wallet.page.click(createTestSelector('settings-create-an-account'));
      await wallet.page.waitForSelector(wallet.$createAccountButton);
      await wallet.page.click(wallet.$createAccountDone);
    }

    for (let i = 0; i < COUNT; i++) {
      await wallet.clickSettingsButton();
      await wallet.page.click(createTestSelector(SettingsSelectors.SwitchAccount));
      await wallet.page.click(createTestSelector(`switch-account-item-${i}`));
      await wallet.page.waitForSelector(createTestSelector(`account-checked-${(i -1 + COUNT) % COUNT}`), {state: 'hidden'})
      let displayName = await wallet.page.textContent(
        createTestSelector('home-current-display-name')
      );
      expect(displayName).toEqual(`Account ${i+1}`);
    }
  });
});
