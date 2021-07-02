import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';

import { setupHeystackEnv } from '@tests/mocks/heystack';
import { postConditionsState } from '@store/transactions/post-conditions';
import { FungibleConditionCode, parsePrincipalString } from '@stacks/transactions';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';

describe('Post conditions', () => {
  setupHeystackEnv();
  it('postConditionsState', async () => {
    const { result } = renderHook(() => useAtomValue(postConditionsState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toBeTruthy();
    expect(result.current!.length).toEqual(1);
    expect(result.current![0].conditionCode).toEqual(FungibleConditionCode.Equal);
    expect(result.current![0].principal).toEqual(
      parsePrincipalString(HEYSTACK_HEY_TX_REQUEST_DECODED.stxAddress)
    );
    expect((result.current![0] as any).assetInfo.contractName.content).toEqual('hey-token');
  });
});
