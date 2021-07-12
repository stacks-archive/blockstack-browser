import { BrowserDriver, createTestSelector, randomString, setupBrowser } from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { ScreenPaths } from '@common/types';
import { SettingsSelectors } from '../settings.selectors';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);
describe(`Settings integration tests`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await wallet.signUp();
  }, 20000);

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to create a new account', async () => {
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector('settings-create-an-account'));
    await wallet.page.click(createTestSelector('create-account-done-button'));
    const displayName = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName).toEqual('Account 2');
  });

  it('should be able to view and save secret key to clipboard', async () => {
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector('settings-view-secret-key'));
    await wallet.page.click(createTestSelector('copy-key-to-clipboard'));
    const copySuccessMessage = await wallet.page.textContent(
      createTestSelector('copy-key-to-clipboard')
    );
    expect(copySuccessMessage).toContain('Copied!');
  });

  it('should be able to sign out, lock and unlock the extension', async () => {
    const secretKey = await wallet.getSecretKey();
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector('settings-sign-out'));

    await wallet.clickSignIn();
    await wallet.enterSecretKey(secretKey);
    const password = randomString(15);
    await wallet.enterPassword(password);
    await wallet.clickSettingsButton();
    await wallet.page.click(createTestSelector('settings-lock'));
    await wallet.enterPassword(password);
    const displayName = await wallet.page.textContent(
      createTestSelector('home-current-display-name')
    );
    expect(displayName).toEqual('Account 1');
  });

  it('should be able to change network', async () => {
    await wallet.clickSettingsButton();
    const currentNetwork = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CurrentNetwork)
    );
    expect(currentNetwork).toContain('mainnet');
    await wallet.page.click(createTestSelector(SettingsSelectors.ChangeNetworkAction));

    const networkListItems = await wallet.page.$$(
      createTestSelector(SettingsSelectors.NetworkListItem)
    );
    expect(networkListItems).toHaveLength(4);
    await networkListItems[2].click(); // TODO: replace with testnet when regtest shuts down
    await wallet.clickSettingsButton();
    const newCurrentNetwork = await wallet.page.textContent(
      createTestSelector(SettingsSelectors.CurrentNetwork)
    );
    expect(newCurrentNetwork).toContain('regtest');
  });
});
