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
});
