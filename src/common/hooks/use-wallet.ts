import { useCallback } from 'react';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  updateWalletConfigWithApp,
  makeAuthResponse,
  getAccountDisplayName,
} from '@stacks/wallet-sdk';
import { useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil';
import { gaiaUrl } from '@common/constants';
import {
  currentNetworkKeyState,
  currentNetworkState,
  networksState,
  latestBlockHeightState,
} from '@store/networks';
import {
  walletState,
  encryptedSecretKeyStore,
  secretKeyState,
  hasSetPasswordState,
  walletConfigStore,
  hasRehydratedVaultStore,
} from '@store/wallet';
import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

import { useOnboardingState } from './auth/use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';
import { apiRevalidation } from '@store/common/api-helpers';
import { useLoadable } from '@common/hooks/use-loadable';
import {
  currentAccountIndexState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { localNoncesState } from '@store/accounts/nonce';
import { bytesToText } from '@store/common/utils';
import { transactionNetworkVersionState } from '@store/transactions';

export const useWallet = () => {
  const hasRehydratedVault = useRecoilValue(hasRehydratedVaultStore);
  const [wallet, setWallet] = useRecoilState(walletState);
  const secretKey = useRecoilValue(secretKeyState);
  const encryptedSecretKey = useRecoilValue(encryptedSecretKeyStore);
  const currentAccountIndex = useRecoilValue(currentAccountIndexState);
  const hasSetPassword = useRecoilValue(hasSetPasswordState);
  const currentAccount = useRecoilValue(currentAccountState);
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressState);
  const transactionVersion = useRecoilValue(transactionNetworkVersionState);
  const networks = useRecoilValue(networksState);
  const currentNetwork = useRecoilValue(currentNetworkState);
  const currentNetworkKey = useRecoilValue(currentNetworkKeyState);
  const walletConfig = useLoadable(walletConfigStore);
  const vaultMessenger = useVaultMessenger();

  const currentAccountDisplayName = currentAccount
    ? getAccountDisplayName(currentAccount)
    : undefined;

  const { decodedAuthRequest, authRequest, appName, appIcon } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doSetLatestNonce = useRecoilCallback(
    ({ snapshot, set }) =>
      async (newNonce?: number) => {
        if (newNonce !== undefined) {
          set(apiRevalidation, current => (current as number) + 1);
          const blockHeight = await snapshot.getPromise(latestBlockHeightState);
          const network = await snapshot.getPromise(currentNetworkState);
          const address = await snapshot.getPromise(currentAccountStxAddressState);
          set(localNoncesState([network.url, address || '']), () => ({
            blockHeight,
            nonce: newNonce,
          }));
        }
      },
    []
  );

  const handleCancelAuthentication = useCallback(() => {
    if (!decodedAuthRequest || !authRequest) {
      return;
    }
    const authResponse = 'cancel';
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  }, [decodedAuthRequest, authRequest]);

  const doFinishSignIn = useRecoilCallback(
    ({ set, snapshot }) =>
      async (accountIndex: number) => {
        const wallet = await snapshot.getPromise(walletState);
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
    [decodedAuthRequest, authRequest, appName, appIcon]
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
    walletConfig,
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
