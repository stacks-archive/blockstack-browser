import React, { StrictMode, Suspense } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { Provider } from 'jotai';
import { walletConfigStore, walletState } from '@store/wallet';
import { TEST_ACCOUNTS_WITH_ADDRESS, TEST_WALLET } from '../../../tests/mocks';
import { useAtomValue } from 'jotai/utils';
import { accountsState, accountsWithAddressState } from '@store/accounts/index';

// This is a wrapper component to provide default/mock data to various atoms
const wrapper: React.FC = ({ children }) => (
  <StrictMode>
    <Suspense fallback="loading">
      <Provider initialValues={[[walletState, TEST_WALLET] as const]}>{children}</Provider>
    </Suspense>
  </StrictMode>
);

describe('account state', () => {
  it('wallet has correct amount of accounts state', async () => {
    const { result } = renderHook(() => useAtomValue(accountsState), { wrapper });
    expect(result.current?.length).toBe(4);
  });

  it('all addresses are correct for test accounts (mainnet)', async () => {
    const promise = Promise.resolve();
    const { result } = renderHook(() => useAtomValue(accountsWithAddressState), {
      wrapper,
    });
    expect(result.current).toEqual(TEST_ACCOUNTS_WITH_ADDRESS);
    await act(() => promise);
  });

  it('wallet config state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAtomValue(walletConfigStore), {
      wrapper,
    });
    await waitForNextUpdate();
    const foundAccount = result.current?.accounts.find(
      account => account.username === 'fdsfdsfdf.id.blockstack'
    );
    expect(!!foundAccount).toBe(true);
  });
});
