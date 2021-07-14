import { ScreenPaths } from '@common/types';

import { SendPage } from '../../page-objects/send-form.page';
import { WalletPage } from '../../page-objects/wallet.page';
import { BrowserDriver, setupBrowser } from '../utils';

jest.setTimeout(30_000);
jest.retryTimes(process.env.CI ? 2 : 0);

describe(`Send tokens flow`, () => {
  let browser: BrowserDriver;
  let walletPage: WalletPage;
  let sendForm: SendPage;

  beforeEach(async () => {
    browser = await setupBrowser();
    walletPage = await WalletPage.init(browser, ScreenPaths.INSTALLED);
    await walletPage.signUp();
    await walletPage.waitForHomePage();
    await walletPage.goToSendForm();
    sendForm = new SendPage(walletPage.page);
  }, 30_000);

  afterEach(async () => {
    try {
      await browser.context.close();
    } catch (error) {}
  });

  describe('Set max button', () => {
    it('does not set a fee below zero, when the account balance is 0 STX', async () => {
      await sendForm.clickSendMaxBtn();
      const amount = await sendForm.getAmountFieldValue();
      expect(amount).toEqual('');
      expect(amount).not.toEqual('-0.00018');
      expect(Number(amount)).not.toBeLessThan(0);
    });
  });

  describe('Form validation', () => {
    it('validates against an invalid address', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('slkfjsdlkfjs');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeTruthy();
    });

    it('does not prohibit valid addresses', async () => {
      await sendForm.inputToAmountField('100000000');
      await sendForm.inputToAddressField('SP15DFMYE5JDDKRMAZSC6947TCERK36JM4KD5VKZD');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$stxAddressFieldError'));
      expect(errorMsg).toBeFalsy();
    });

    it('validates against a negative amount of tokens', async () => {
      await sendForm.inputToAmountField('-9999');
      await sendForm.inputToAddressField('ess-pee');
      await sendForm.clickPreviewTxBtn();
      const errorMsg = await sendForm.page.isVisible(sendForm.getSelector('$amountFieldError'));
      expect(errorMsg).toBeTruthy();
    });
  });
});
