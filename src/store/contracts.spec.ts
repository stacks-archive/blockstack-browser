import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import {
  contractInterfaceResponseState,
  contractInterfaceState,
  contractSourceResponseState,
  contractSourceState,
} from './contracts';

import * as utils from '@store/common/utils';
import { ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import { setupHeystackEnv } from '@tests/mocks/heystack';
import { HEYSTACK_HEY_TX_REQUEST_DECODED } from '@tests/mocks';

const params = {
  contractAddress: HEYSTACK_HEY_TX_REQUEST_DECODED.contractAddress,
  contractName: HEYSTACK_HEY_TX_REQUEST_DECODED.contractName,
};
const functionNameToFind = 'like-message';

describe('Contracts atom state', () => {
  setupHeystackEnv();
  it('can fetch, set, and use local state for contract interface', async () => {
    const setLocalData = jest.spyOn(utils, 'setLocalData');
    const getLocalData = jest.spyOn(utils, 'getLocalData');
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(contractInterfaceResponseState(params)),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    // suspended
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate({ timeout: 3000 });
    // resolved data
    expect(result.current?.functions.length).toEqual(9);
    // sets the local data
    expect(setLocalData).toBeCalledTimes(1);

    // this will by default use the local data version
    const interfaceState = renderHook(() => useAtomValue(contractInterfaceState(params)), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    // will not suspend because it's local
    expect(interfaceState.result.current).toEqual(result.current);
    // getLocalData should fire
    expect(getLocalData).toBeCalledTimes(1);
  });

  it('can fetch, set, and use local state for contract source', async () => {
    const setLocalData = jest.spyOn(utils, 'setLocalData');
    const getLocalData = jest.spyOn(utils, 'getLocalData');
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(contractSourceResponseState(params)),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    // suspended
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate({ timeout: 6000 });
    // resolved data
    expect(result.current?.source).toContain(functionNameToFind);
    // sets the local data
    expect(setLocalData).toBeCalledTimes(1);

    // this will by default use the local data version
    const interfaceState = renderHook(() => useAtomValue(contractSourceState(params)), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    // will not suspend because it's local
    expect(interfaceState.result.current.source).toEqual(result.current.source);
    // getLocalData should fire
    expect(getLocalData).toBeCalledTimes(1);
  });
});
