import { Page } from 'playwright-core';
import { createTestSelector } from '../utils';
import { SendFormSelectors } from './send-form.selectors';

export class SendPage {
  constructor(public page: Page) {}

  $amountField = createTestSelector(SendFormSelectors.InputAmountField);

  async clickSendMaxBtn() {
    await this.page.click(createTestSelector(SendFormSelectors.BtnSendMaxBalance));
  }

  async getAmountFieldValue() {
    return this.page.$eval(this.$amountField, (el: HTMLInputElement) => el.value);
  }
}
