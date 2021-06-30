import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ProviderWithWalletAndRequestToken } from '../../../../../tests/state-utils';
import { PostConditions } from './list';
import { delay } from '@common/utils';

const message = 'You will transfer exactly 1 HEY or the transaction will abort.';
const from = 'From ST2P…ZE7Z';
const firstTokenName = 'hey-token';
const sip10Name = 'Heystack Token';

describe('<PostConditions />', () => {
  it('has correct message around transfer and principal', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <PostConditions />
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      getByText(message);
      getByText(from);
    });
  });

  it('uses asset name as fallback, then loads the correct SIP 10 name', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <PostConditions />
      </ProviderWithWalletAndRequestToken>
    );

    await waitFor(() => {
      getByText(firstTokenName);
    });
    await delay(500); // the token name is loaded async, pad the timing here
    await waitFor(() => {
      getByText(sip10Name);
    });
  });
});
