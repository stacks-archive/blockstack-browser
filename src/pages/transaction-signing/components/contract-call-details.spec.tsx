import React from 'react';
import { render, waitFor } from '@testing-library/react';

import { ProviderWithWalletAndRequestToken } from '../../../../tests/state-utils';
import { ContractCallDetails } from './contract-call-details';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '../../../../tests/mocks';
import { truncateMiddle } from '@stacks/ui-utils';
import { cvToString, deserializeCV } from '@stacks/transactions';

const truncatedContractAddress = truncateMiddle(HEYSTACK_HEY_TX_REQUEST_DECODED.contractAddress, 4);
const truncatedContractId = `${truncatedContractAddress}.${HEYSTACK_HEY_TX_REQUEST_DECODED.contractName}`;

const getStringValueFromHexCv = (hex: string) => {
  const argCV = deserializeCV(Buffer.from(hex, 'hex'));
  return cvToString(argCV);
};
const message = getStringValueFromHexCv(HEYSTACK_HEY_TX_REQUEST_DECODED.functionArgs[0]);
const giphyUrl = getStringValueFromHexCv(HEYSTACK_HEY_TX_REQUEST_DECODED.functionArgs[1]);

describe('<ContractCallDetails />', () => {
  it('correctly displays the contract address and function name', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <ContractCallDetails />
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      getByText(HEYSTACK_HEY_TX_REQUEST_DECODED.functionName);
      getByText(truncatedContractId);
    });
  });

  it('correctly displays the function arguments (message and giphy url)', async () => {
    const { getByText } = render(
      <ProviderWithWalletAndRequestToken>
        <ContractCallDetails />
      </ProviderWithWalletAndRequestToken>
    );
    await waitFor(() => {
      getByText(message);
      getByText(giphyUrl);
    });
  });
});
