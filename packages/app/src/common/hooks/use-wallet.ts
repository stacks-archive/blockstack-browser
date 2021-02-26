import { useCallback } from 'react';
import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  updateWalletConfigWithApp,
  makeAuthResponse,
  getAccountDisplayName,
} from '@stacks/wallet-sdk';
import { useRecoilValue, useRecoilState, useRecoilCallback } from 'recoil';
import { useDispatch } from 'react-redux';
import { gaiaUrl } from '@common/constants';
import {
  currentNetworkKeyStore,
  currentNetworkStore,
  networksStore,
  currentTransactionVersion,
} from '@store/recoil/networks';
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
} from '@store/recoil/wallet';
import { StacksTransaction } from '@stacks/transactions';
import { useVaultMessenger } from '@common/hooks/use-vault-messenger';

import { ScreenPaths } from '@store/onboarding/types';
import { useOnboardingState } from './use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';
import { doChangeScreen, saveAuthRequest } from '@store/onboarding/actions';
import { doTrackScreenChange } from '@common/track';
import { AppManifest, DecodedAuthRequest } from '@common/dev/types';
import { decodeToken } from 'jsontokens';
import { latestBlockHeightStore, apiRevalidation } from '@store/recoil/api';
import { useLoadable } from '@common/hooks/use-loadable';
import { isValidUrl } from '@common/validate-url';
import { defaultHeaders } from '@common/api/fetch';

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri, { headers: defaultHeaders });
  const json: AppManifest = await res.json();
  return json;
};

export const useWallet = () => {
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

  const dispatch = useDispatch();
  const { decodedAuthRequest, authRequest, appName, appIcon, screen } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doSetLatestNonce = useRecoilCallback(
    ({ snapshot, set }) => async (tx: StacksTransaction) => {
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

  const doFinishSignIn = useRecoilCallback(
    ({ set, snapshot }) => async (accountIndex: number) => {
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

  const doSaveAuthRequest = useCallback(
    async (authRequest: string) => {
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
      const dangerousUri = decodedAuthRequest.redirect_uri;
      if (!isValidUrl(dangerousUri)) {
        throw new Error('Cannot proceed with malicious url');
      }
      let appName = decodedAuthRequest.appDetails?.name;
      let appIcon = decodedAuthRequest.appDetails?.icon;

      if (!appName || !appIcon) {
        const appManifest = await loadManifest(decodedAuthRequest);
        appName = appManifest.name;
        appIcon = appManifest.icons[0].src as string;
      }

      dispatch(
        saveAuthRequest({
          decodedAuthRequest,
          authRequest,
          appName,
          appIcon,
          appURL: new URL(decodedAuthRequest.redirect_uri),
        })
      );

      const hasIdentities = wallet?.accounts && wallet.accounts.length;
      if ((screen === ScreenPaths.GENERATION || screen === ScreenPaths.SIGN_IN) && hasIdentities) {
        doTrackScreenChange(ScreenPaths.CHOOSE_ACCOUNT, decodedAuthRequest);
        dispatch(doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT));
      } else {
        doTrackScreenChange(screen, decodedAuthRequest);
      }
    },
    [dispatch, wallet?.accounts, screen]
  );

  return {
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
    doSaveAuthRequest,
    doSetLatestNonce,
    setWallet,
    ...vaultMessenger,
  };
};
