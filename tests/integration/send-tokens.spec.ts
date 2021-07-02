import { ScreenPaths } from '@common/types';
import { SendPage } from './page-objects/send-form.page';

import { WalletPage } from './page-objects/wallet.page';
import { BrowserDriver, setupBrowser } from './utils';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Send tokens flow`, () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendFormPage: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await walletPage.signUp();
    await walletPage.goToSendForm();
    sendFormPage = new SendPage(walletPage.page);
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  it('should not set a fee below zero when the account balance is 0 STX', async () => {
    await sendFormPage.clickSendMaxBtn();
    const amount = await sendFormPage.getAmountFieldValue();

    expect(amount).toEqual('');
    expect(amount).not.toEqual('-0.00018');
  });
});
