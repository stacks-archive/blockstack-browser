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
  currentNetworkKeyStore,
  currentNetworkStore,
  networksStore,
  currentTransactionVersion,
} from '@store/networks';
import {
  walletStore,
  encryptedSecretKeyStore,
  secretKeyStore,
  hasSetPasswordStore,
  latestNoncesStore,
  currentAccountIndexStore,
  currentAccountStore,
  walletConfigStore,
  currentAccountStxAddressStore,
  hasRehydratedVaultStore,
} from '@store/wallet';
import { StacksTransaction } from '@stacks/transactions';
import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

import { useOnboardingState } from './use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';
import { latestBlockHeightStore, apiRevalidation } from '@store/api';
import { useLoadable } from '@common/hooks/use-loadable';

export const useWallet = () => {
  const hasRehydratedVault = useRecoilValue(hasRehydratedVaultStore);
  const [wallet, setWallet] = useRecoilState(walletStore);
  const secretKey = useRecoilValue(secretKeyStore);
  const encryptedSecretKey = useRecoilValue(encryptedSecretKeyStore);
  const currentAccountIndex = useRecoilValue(currentAccountIndexStore);
  const hasSetPassword = useRecoilValue(hasSetPasswordStore);
  const currentAccount = useRecoilValue(currentAccountStore);
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressStore);
  const transactionVersion = useRecoilValue(currentTransactionVersion);
  const networks = useRecoilValue(networksStore);
  const currentNetwork = useRecoilValue(currentNetworkStore);
  const currentNetworkKey = useRecoilValue(currentNetworkKeyStore);
  const walletConfig = useLoadable(walletConfigStore);
  const vaultMessenger = useVaultMessenger();

  const currentAccountDisplayName = currentAccount
    ? getAccountDisplayName(currentAccount)
    : undefined;

  const { decodedAuthRequest, authRequest, appName, appIcon } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doSetLatestNonce = useRecoilCallback(
    ({ snapshot, set }) =>
      async (tx: StacksTransaction) => {
        const newNonce = tx.auth.spendingCondition?.nonce.toNumber();
        if (newNonce !== undefined) {
          set(apiRevalidation, current => (current as number) + 1);
          const blockHeight = await snapshot.getPromise(latestBlockHeightStore);
          const network = await snapshot.getPromise(currentNetworkStore);
          const address = await snapshot.getPromise(currentAccountStxAddressStore);
          set(latestNoncesStore([network.url, address || '']), () => ({
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
        const wallet = await snapshot.getPromise(walletStore);
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
        set(currentAccountIndexStore, accountIndex);
        finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      },
    [decodedAuthRequest, authRequest, appName, appIcon]
  );

  return {
    hasRehydratedVault,
    wallet,
    secretKey,
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
