import { renderHook } from '@testing-library/react-hooks';
import { useAtomValue } from 'jotai/utils';
import { mockLocalStorage, ProviderWithWalletAndRequestToken } from '@tests/state-utils';
import {
  requestTokenOriginState,
  requestTokenPayloadState,
  requestTokenState,
  transactionRequestNetwork,
  transactionRequestStxAddressState,
  transactionRequestValidationState,
} from '@store/transactions/requests';
import { getKeyForRequest, StorageKey } from '@common/storage';
import { TransactionTypes } from '@stacks/connect';
import { currentNetworkState } from '@store/networks';
import { currentAccountStxAddressState } from '@store/accounts';

const ORIGIN = 'https://heystack.xyz';
const TESTNET_ADDRESS = 'ST2PHCPANVT8DVPSY5W2ZZ81M285Q5Z8Y6DQMZE7Z';
const REGTEST_URL = 'https://stacks-node-api.regtest.stacks.co';
const TABID = 'this_is_fake';
mockLocalStorage();

function renderRequestTokenHook() {
  return renderHook(() => useAtomValue(requestTokenState), {
    wrapper: ProviderWithWalletAndRequestToken,
  });
}

function mockTokenOriginRequest() {
  const { result: requestToken } = renderRequestTokenHook();

  // mock the tab origin functionality
  const key = getKeyForRequest(StorageKey.transactionRequests, requestToken.current as string);
  const requestInfo = {
    tabId: TABID,
    origin: ORIGIN,
  };

  localStorage.setItem(key, JSON.stringify(requestInfo));
}

describe('transaction request state', () => {
  it('requestTokenPayloadState: jwt can be decoded correctly', () => {
    const { result } = renderHook(() => useAtomValue(requestTokenPayloadState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current?.txType).toEqual(TransactionTypes.ContractCall);
  });

  it('requestTokenOriginState', () => {
    // we need to mock the origin
    mockTokenOriginRequest();
    // token origin
    const { result } = renderHook(() => useAtomValue(requestTokenOriginState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toEqual(ORIGIN);
  });

  it('transactionRequestValidationState: jtw is validated correctly', async () => {
    mockTokenOriginRequest();
    // token origin
    const { result, waitForNextUpdate } = renderHook(
      () => useAtomValue(transactionRequestValidationState),
      {
        wrapper: ProviderWithWalletAndRequestToken,
      }
    );
    await waitForNextUpdate();
    expect(result.current).toBeTruthy();
  });

  it('transactionRequestStxAddressState: token address is correct', () => {
    const { result } = renderHook(() => useAtomValue(transactionRequestStxAddressState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toEqual(TESTNET_ADDRESS);
  });

  it('currentAccountStxAddressState: current account is tx request account', () => {
    const { result } = renderHook(() => useAtomValue(currentAccountStxAddressState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current).toEqual(TESTNET_ADDRESS);
  });

  it('transactionRequestNetwork: token network is correct', () => {
    const { result } = renderHook(() => useAtomValue(transactionRequestNetwork), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current?.coreApiUrl).toEqual(REGTEST_URL);
  });

  it('currentNetworkState: current network is tx network', () => {
    const { result } = renderHook(() => useAtomValue(currentNetworkState), {
      wrapper: ProviderWithWalletAndRequestToken,
    });
    expect(result.current?.url).toEqual(REGTEST_URL);
  });
});
