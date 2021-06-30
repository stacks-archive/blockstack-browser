import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import { ProviderWithWalletAndRequestToken } from '../../../tests/state-utils';

import {
  transactionContractInterfaceState,
  transactionContractSourceState,
  transactionFunctionsState,
} from '@store/transactions/contract-call';
import { setupHeystackEnv } from '../../../tests/mocks/heystack';

const functionName = 'send-message';

describe('transactions/contract-call state', () => {
  setupHeystackEnv();
  it('correctly fetches the interface for the transaction request', async () => {
    // token origin
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(transactionContractInterfaceState),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current?.functions.find(func => func.name === functionName)).toBeTruthy();
  });

  it('correctly fetches the contract source for the transaction request', async () => {
    // token origin
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(transactionContractSourceState),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current?.source).toContain(functionName);
  });

  it('finds the correct function in the interface related to the current request', async () => {
    // token origin
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(transactionFunctionsState),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    expect(result.current).toEqual(undefined);
    await waitForNextUpdate();
    expect(result.current?.name).toEqual(functionName);
  });
});
