// This is a wrapper component to provide default/mock data to various atoms
import React from 'react';
import { Provider } from 'jotai';
import { walletState } from '@store/wallet';
import { TEST_WALLET, HEYSTACK_HEY_TX_REQUEST } from './mocks';
import { requestTokenState } from '@store/transactions/requests';
import Mock = jest.Mock;

export const ProviderWithWalletAndRequestToken: React.FC = ({ children }) => (
  <Provider
    initialValues={
      [
        [walletState, TEST_WALLET],
        [requestTokenState, HEYSTACK_HEY_TX_REQUEST],
      ] as const
    }
  >
    {children}
  </Provider>
);

export function mockLocalStorage() {
  let mockLocalStorage: Record<string, string> = {};

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockLocalStorage[key] = value;
    });
    global.Storage.prototype.getItem = jest.fn(key => mockLocalStorage[key]);
  });

  beforeEach(() => {
    // make sure the fridge starts out empty for each test
    mockLocalStorage = {};
  });

  afterAll(() => {
    // return our mocks to their original values
    // 🚨 THIS IS VERY IMPORTANT to avoid polluting future tests!
    (global.Storage.prototype.setItem as Mock).mockReset();
    (global.Storage.prototype.getItem as Mock).mockReset();
  });
}
