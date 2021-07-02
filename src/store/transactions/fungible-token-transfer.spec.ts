import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import { ProviderWithWalletAndRequestToken } from '../../../tests/state-utils';

import { makeFungibleTokenTransferState } from '@store/transactions/fungible-token-transfer';
import { setupHeystackEnv } from '../../../tests/mocks/heystack';

describe(makeFungibleTokenTransferState.debugLabel || 'makeFungibleTokenTransferState', () => {
  setupHeystackEnv();
  it('correctly generates the expected values', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(makeFungibleTokenTransferState),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current?.stxAddress).toEqual('ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z');
    expect(result.current?.assetName).toEqual('hey-token');
  });
});
