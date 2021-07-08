import React from 'react';
import userEvent from '@testing-library/user-event';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWitHeySelectedAsset } from '@tests/state-utils';
import { render } from '@testing-library/react';
import { SendTokensForm } from '@pages/send-tokens/send-tokens';
import { SendFormSelectors } from '@tests/integration/page-objects/send-form.selectors';

describe('Send form tests', () => {
  setupHeystackEnv();

  it('does not allow user entry of decimal values', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Preview');
    const element: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    userEvent.type(element, '0.123');
    expect((element as HTMLInputElement).value).toEqual('123');
  });

  it('shows an error message when user pastes in an amount that is not supported by selected asset', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Preview');
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);

    userEvent.paste(amountField, '0.123');
    userEvent.paste(recipientField, 'ST1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RD69GE2');
    expect((amountField as HTMLInputElement).value).toEqual('0.123');
    userEvent.click(previewBtn);
    await findByText('This token does not support decimal places.');
  });

  it('shows an error message when user tries to send more than their balance', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Preview');
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);

    userEvent.paste(amountField, '999999999');
    userEvent.paste(recipientField, 'ST1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RD69GE2');
    userEvent.click(previewBtn);
    await findByText('Cannot transfer more than balance');
  });
});
