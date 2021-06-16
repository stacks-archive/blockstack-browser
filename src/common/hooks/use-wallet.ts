import { useCallback } from 'react';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  updateWalletConfigWithApp,
  makeAuthResponse,
  getAccountDisplayName,
} from '@stacks/wallet-sdk';

import { gaiaUrl } from '@common/constants';
import { currentNetworkKeyState, currentNetworkState, networksState } from '@store/networks';
import {
  walletState,
  encryptedSecretKeyStore,
  secretKeyState,
  hasSetPasswordState,
  hasRehydratedVaultStore,
} from '@store/wallet';
import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

import { useOnboardingState } from './auth/use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';

import {
  currentAccountIndexState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { localNoncesState } from '@store/accounts/nonce';
import { bytesToText } from '@store/common/utils';
import { transactionNetworkVersionState } from '@store/transactions';
import { useAtom } from 'jotai';
import { useAtomValue, useAtomCallback } from 'jotai/utils';

export const useWallet = () => {
  const hasRehydratedVault = useAtomValue(hasRehydratedVaultStore);
  const [wallet, setWallet] = useAtom(walletState);
  const secretKey = useAtomValue(secretKeyState);
  const encryptedSecretKey = useAtomValue(encryptedSecretKeyStore);
  const currentAccountIndex = useAtomValue(currentAccountIndexState);
  const hasSetPassword = useAtomValue(hasSetPasswordState);
  const currentAccount = useAtomValue(currentAccountState);
  const currentAccountStxAddress = useAtomValue(currentAccountStxAddressState);
  const transactionVersion = useAtomValue(transactionNetworkVersionState);
  const networks = useAtomValue(networksState);
  const currentNetwork = useAtomValue(currentNetworkState);
  const currentNetworkKey = useAtomValue(currentNetworkKeyState);
  const vaultMessenger = useVaultMessenger();

  const currentAccountDisplayName = currentAccount
    ? getAccountDisplayName(currentAccount)
    : undefined;

  const { decodedAuthRequest, authRequest, appName, appIcon } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doSetLatestNonce = useAtomCallback<void, number>(
    useCallback((get, set, newNonce) => {
      if (newNonce !== undefined) {
        const network = get(currentNetworkState);
        const address = get(currentAccountStxAddressState);
        set(localNoncesState([network.url, address || '']), newNonce);
      }
    }, [])
  );

  const handleCancelAuthentication = useCallback(() => {
    if (!decodedAuthRequest || !authRequest) {
      return;
    }
    const authResponse = 'cancel';
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  }, [decodedAuthRequest, authRequest]);

  const doFinishSignIn = useAtomCallback<void, number>(
    useCallback(
      async (get, set, accountIndex) => {
        const wallet = get(walletState);
        const account = wallet?.accounts[accountIndex];
        if (!decodedAuthRequest || !authRequest || !account || !wallet) {
          console.error('Uh oh! Finished onboarding without auth info.');
          return;
        }
        const appURL = new URL(decodedAuthRequest.redirect_uri);
        const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
        const walletConfig = await getOrCreateWalletConfig({
          wallet,
          gaiaHubConfig,
          skipUpload: true,
        });
        await updateWalletConfigWithApp({
          wallet,
          walletConfig,
          gaiaHubConfig,
          account,
          app: {
            origin: appURL.origin,
            lastLoginAt: new Date().getTime(),
            scopes: decodedAuthRequest.scopes,
            appIcon: appIcon as string,
            name: appName as string,
          },
        });
        const authResponse = await makeAuthResponse({
          gaiaHubUrl: gaiaUrl,
          appDomain: appURL.origin,
          transitPublicKey: decodedAuthRequest.public_keys[0],
          scopes: decodedAuthRequest.scopes,
          account,
        });
        set(currentAccountIndexState, accountIndex);
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      },
      [appName, appIcon, authRequest, decodedAuthRequest]
    )
  );

  return {
    hasRehydratedVault,
    wallet,
    secretKey: secretKey ? bytesToText(secretKey) : undefined,
    isSignedIn,
    currentAccount,
    currentAccountIndex,
    currentAccountStxAddress,
    currentAccountDisplayName,
    transactionVersion,

    networks,
    currentNetwork,
    currentNetworkKey,
    encryptedSecretKey,
    hasSetPassword,
    doFinishSignIn,
    doSetLatestNonce,
    setWallet,
    handleCancelAuthentication,
    ...vaultMessenger,
  };
};
