import { Page } from 'playwright-core';
import { createTestSelector } from '../utils';
import { SendFormSelectors } from './send-form.selectors';

const selectors = {
  $btnSendMaxBalance: createTestSelector(SendFormSelectors.BtnSendMaxBalance),
  $amountField: createTestSelector(SendFormSelectors.InputAmountField),
  $amountFieldError: createTestSelector(SendFormSelectors.InputAmountFieldErrorLabel),
  $stxAddressField: createTestSelector(SendFormSelectors.InputRecipientField),
  $stxAddressFieldError: createTestSelector(SendFormSelectors.InputRecipientFieldErrorLabel),
  $previewBtn: createTestSelector(SendFormSelectors.BtnPreviewSendTx),
};

export class SendPage {
  selectors = selectors;

  constructor(public page: Page) {}

  async select(selector: keyof typeof selectors) {
    return this.page.$(selectors[selector]);
  }

  getSelector(selector: keyof typeof selectors) {
    return this.selectors[selector];
  }

  async clickSendMaxBtn() {
    await this.page.click(this.selectors.$btnSendMaxBalance);
  }

  async clickPreviewTxBtn() {
    await this.page.click(this.selectors.$previewBtn);
  }

  async getAmountFieldValue() {
    return this.page.$eval(this.selectors.$amountField, (el: HTMLInputElement) => el.value);
  }

  async inputToAmountField(input: string) {
    const field = await this.page.$(this.selectors.$amountField);
    await field?.type(input);
  }

  async inputToAddressField(input: string) {
    const field = await this.page.$(this.selectors.$stxAddressField);
    await field?.type(input);
  }
}
