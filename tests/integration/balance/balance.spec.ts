import {
  BrowserDriver,
  createTestSelector,
  selectTestNet,
  setupBrowser
} from '../utils';
import { WalletPage } from '../../page-objects/wallet.page';
import { ScreenPaths } from '@common/types';
import {BalanceSelectors} from "@tests/integration/balance.selectors";
import { SECRET_KEY_2 } from "@tests/mocks";

jest.setTimeout(50_000);
jest.retryTimes(process.env.CI ? 2 : 0);

const getAmount = (stxAmount: string) => {
  return stxAmount? parseFloat(stxAmount.replace(/,/g, '')): 0;
};

describe(`Wallet Balance integration tests`, () => {
  const BEFORE_ALL_TIMEOUT = 60000;
  let browser: BrowserDriver;
  let wallet: WalletPage;

  beforeAll(async () => {
    browser = await setupBrowser();
    wallet = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await wallet.signIn(SECRET_KEY_2);
    await selectTestNet(wallet);
    await wallet.waitForHomePage();
  }, BEFORE_ALL_TIMEOUT);

  afterAll(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('Check stacks token balance is greater than 0', async () => {
    const stxAmount = await wallet.page.textContent(
      createTestSelector(BalanceSelectors.StacksToken)
    );
    const actualAmount = stxAmount && getAmount(stxAmount);
    expect(actualAmount).toBeGreaterThan(0);
  });

  it('Check rocket token balance is greater than 0', async () => {
    const rocketAmount = await wallet.page.textContent(
      createTestSelector(BalanceSelectors.RocketToken)
    );
    const actualAmount = rocketAmount && getAmount(rocketAmount);
    expect(actualAmount).toBeGreaterThan(0);
  });

  it('Check stella token balance is greater than 0', async () => {
    const stellaAmount = await wallet.page.textContent(
      createTestSelector(BalanceSelectors.StellaToken)
    );
    const actualAmount = stellaAmount && getAmount(stellaAmount);
    expect(actualAmount).toBeGreaterThan(0);
  });
});
