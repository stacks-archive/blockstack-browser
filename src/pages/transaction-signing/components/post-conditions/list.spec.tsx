import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { PostConditions } from './list';

import { delay } from '@common/utils';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { setupHeystackEnv } from '@tests/mocks/heystack';

const message = 'You will transfer exactly 1 HEY or the transaction will abort.';
const from = 'ST2P…ZE7Z';
const firstTokenName = 'hey-token';
const sip10Name = 'Heystack Token';

describe('<PostConditions />', () => {
  setupHeystackEnv();
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
