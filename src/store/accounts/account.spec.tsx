import { act, renderHook } from '@testing-library/react-hooks';
import { walletConfigStore } from '@store/wallet';
import { TEST_ACCOUNTS_WITH_ADDRESS } from '../../../tests/mocks';
import { useAtomValue } from 'jotai/utils';
import { accountsState, accountsWithAddressState } from '@store/accounts/index';
import { ProviderWithTestWallet } from '../../../tests/state-utils';

describe('account state', () => {
  it('wallet has correct amount of accounts state', async () => {
    const { result } = renderHook(() => useAtomValue(accountsState), {
      wrapper: ProviderWithTestWallet,
    });
    expect(result.current?.length).toBe(4);
  });

  it('all addresses are correct for test accounts (mainnet)', async () => {
    const promise = Promise.resolve();
    const { result } = renderHook(() => useAtomValue(accountsWithAddressState), {
      wrapper: ProviderWithTestWallet,
    });
    expect(result.current).toEqual(TEST_ACCOUNTS_WITH_ADDRESS);
    await act(() => promise);
  });

  it('wallet config state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAtomValue(walletConfigStore), {
      wrapper: ProviderWithTestWallet,
    });
    await waitForNextUpdate({ timeout: 10000 }); // 10 secs?
    const foundAccount = result.current?.accounts.find(
      account => account.username === 'fdsfdsfdf.id.blockstack'
    );
    expect(!!foundAccount).toBe(true);
  });
});
