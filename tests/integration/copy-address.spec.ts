import { createTestSelector, BrowserDriver, setupBrowser } from './utils';
import { WalletPage } from './page-objects/wallet.page';
import { ScreenPaths } from '@common/types';
import { validateStacksAddress } from '@common/stacks-utils';
import { UserAreaSelectors } from './user-area.selectors';


jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);
describe(`Copy Address`, () => {
  let browser: BrowserDriver;
  let wallet: WalletPage;

  const readClipboard = async () => {
    return await wallet.page.evaluate(() => window.navigator.clipboard.readText());
  }

  beforeEach(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, ScreenPaths.INSTALLED);
  }, 10000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should be able to copy address', async () => {
    await wallet.signUp();
    await wallet.page.click(createTestSelector(UserAreaSelectors.AccountBalancesCopyAddress));
    let copiedAddress = await readClipboard();
    expect(validateStacksAddress(copiedAddress)).toBeTruthy();

    await wallet.page.click(createTestSelector(UserAreaSelectors.AccountCopyAddress));
    copiedAddress = await readClipboard();
    expect(validateStacksAddress(copiedAddress)).toBeTruthy();

    await wallet.page.click('text=Receive');
    await wallet.page.click('text=Copy your address');

    copiedAddress = await readClipboard();
    expect(validateStacksAddress(copiedAddress)).toBeTruthy();
  });
});
