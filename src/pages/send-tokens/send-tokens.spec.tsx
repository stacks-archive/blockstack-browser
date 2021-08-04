import React from 'react';
import userEvent from '@testing-library/user-event';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { ProviderWitHeySelectedAsset } from '@tests/state-utils';
import { render } from '@testing-library/react';
import { SendTokensForm } from '@pages/send-tokens/send-tokens';
import { SendFormSelectors } from '@tests/page-objects/send-form.selectors';
import { SendFormErrorMessages } from '@pages/send-tokens/hooks/use-send-form-validation';

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
    await findByText('Amount');
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
    await findByText('Amount');
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);

    userEvent.paste(amountField, '0.123');
    userEvent.paste(recipientField, 'ST1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RD69GE2');
    expect((amountField as HTMLInputElement).value).toEqual('0.123');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.DoesNotSupportDecimals);
  });

  it('shows an error message when user tries to send more than their balance', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Amount');
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);

    userEvent.paste(amountField, '999999999');
    userEvent.paste(recipientField, 'ST1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RD69GE2');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.InsufficientBalance, { exact: false });
  });

  it('shows an error message when user enters invalid address', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Amount');
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);

    userEvent.paste(amountField, '1');
    userEvent.paste(recipientField, 'asdasda');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.InvalidAddress);
  });

  it('shows an error message when user enters address of different mode', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Amount');
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);

    userEvent.paste(amountField, '1');
    userEvent.paste(recipientField, 'SP1WFVXMKC8FYZ556BF3ZA7NSRNPS2GAR1TR83E6B');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.IncorrectAddressMode);
  });

  it('shows an error message when user enters their address', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Amount');
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);

    userEvent.paste(amountField, '1');
    userEvent.paste(recipientField, 'ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.SameAddress);
  });

  it('shows an error message when user enters 0 amount', async () => {
    const { getByTestId, findByText } = render(
      <React.Suspense fallback={<>loading</>}>
        <ProviderWitHeySelectedAsset>
          <SendTokensForm />
        </ProviderWitHeySelectedAsset>
      </React.Suspense>
    );
    await findByText('Amount');
    const recipientField: HTMLElement = getByTestId(SendFormSelectors.InputRecipientField);
    const previewBtn: HTMLElement = getByTestId(SendFormSelectors.BtnPreviewSendTx);
    const amountField: HTMLElement = getByTestId(SendFormSelectors.InputAmountField);

    userEvent.paste(amountField, '0');
    userEvent.paste(recipientField, 'ST1P72Z3704VMT3DMHPP2CB8TGQWGDBHD3RD69GE2');
    userEvent.click(previewBtn);
    await findByText(SendFormErrorMessages.MustNotBeZero);
  });
});
