import { useCallback } from 'react';
import {
  generateWallet,
  generateSecretKey,
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  updateWalletConfigWithApp,
  makeAuthResponse,
  encrypt,
  decrypt,
  generateNewAccount,
  restoreWalletAccounts,
  updateWalletConfig,
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

import { DEFAULT_PASSWORD, ScreenPaths } from '@store/onboarding/types';
import { useOnboardingState } from './use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';
import { doChangeScreen, saveAuthRequest } from '@store/onboarding/actions';
import { doTrackScreenChange } from '@common/track';
import { AppManifest, DecodedAuthRequest } from '@common/dev/types';
import { decodeToken } from 'jsontokens';
import { latestBlockHeightStore } from '@store/recoil/api';
import { useLoadable } from '@common/hooks/use-loadable';
import { ATOM_LOCALSTORAGE_PREFIX } from '@store/recoil';

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri);
  const json: AppManifest = await res.json();
  return json;
};

export const useWallet = () => {
  const [wallet, setWallet] = useRecoilState(walletStore);
  const secretKey = useRecoilValue(secretKeyStore);
  const [encryptedSecretKey, setEncryptedSecretKey] = useRecoilState(encryptedSecretKeyStore);
  const currentAccountIndex = useRecoilValue(currentAccountIndexStore);
  const [hasSetPassword, setHasSetPassword] = useRecoilState(hasSetPasswordStore); // 🧐 setHasSetPassword 🤮
  const currentAccount = useRecoilValue(currentAccountStore);
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressStore);
  const transactionVersion = useRecoilValue(currentTransactionVersion);
  const networks = useRecoilValue(networksStore);
  const currentNetwork = useRecoilValue(currentNetworkStore);
  const currentNetworkKey = useRecoilValue(currentNetworkKeyStore);
  const walletConfig = useLoadable(walletConfigStore);

  let currentAccountDisplayName = undefined;
  if (currentAccount) {
    currentAccountDisplayName = getAccountDisplayName(currentAccount);
  }

  const dispatch = useDispatch();
  const { decodedAuthRequest, authRequest, appName, appIcon, screen } = useOnboardingState();

  const isSignedIn = !!wallet;

  const doMakeWallet = useRecoilCallback(
    ({ set }) => async () => {
      const secretKey = generateSecretKey(256);
      const wallet = await generateWallet({ secretKey, password: DEFAULT_PASSWORD });
      set(walletStore, wallet);
      set(secretKeyStore, secretKey);
      set(encryptedSecretKeyStore, wallet.encryptedSecretKey);
      set(currentAccountIndexStore, 0);
    },
    []
  );

  const doStoreSeed = useRecoilCallback(
    ({ set }) => async (secretKey: string, password?: string) => {
      const generatedWallet = await generateWallet({
        secretKey,
        password: password || DEFAULT_PASSWORD,
      });
      const wallet = await restoreWalletAccounts({
        wallet: generatedWallet,
        gaiaHubUrl: gaiaUrl,
      });
      set(walletStore, wallet);
      set(secretKeyStore, secretKey);
      set(encryptedSecretKeyStore, wallet.encryptedSecretKey);
      set(currentAccountIndexStore, 0);
      if (password !== undefined) set(hasSetPasswordStore, true);
    },
    []
  );

  const doCreateNewAccount = useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const secretKey = await snapshot.getPromise(secretKeyStore);
      const wallet = await snapshot.getPromise(walletStore);
      if (!secretKey || !wallet) {
        throw 'Unable to create a new account - not logged in.';
      }
      const newWallet = generateNewAccount(wallet);
      set(walletStore, newWallet);
      set(currentAccountIndexStore, newWallet.accounts.length - 1);
      const updateConfig = async () => {
        const gaiaHubConfig = await createWalletGaiaConfig({ gaiaHubUrl: gaiaUrl, wallet });
        await updateWalletConfig({
          wallet: newWallet,
          gaiaHubConfig,
        });
      };
      void updateConfig();
    },
    []
  );

  const doSignOut = useRecoilCallback(({ reset }) => () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(ATOM_LOCALSTORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    reset(walletStore);
    reset(currentAccountIndexStore);
    reset(secretKeyStore);
    reset(encryptedSecretKeyStore);
    reset(hasSetPasswordStore);
    reset(networksStore);
    reset(currentNetworkKeyStore);
  });

  const doSetPassword = useCallback(
    async (password: string) => {
      if (!secretKey) {
        throw new Error('Cannot set password - not logged in.');
      }
      const encryptedBuffer = await encrypt(secretKey, password);
      setEncryptedSecretKey(encryptedBuffer.toString('hex'));
      setHasSetPassword(true);
    },
    [secretKey, setEncryptedSecretKey, setHasSetPassword]
  );

  const doSetLatestNonce = useRecoilCallback(
    ({ snapshot, set }) => async (tx: StacksTransaction) => {
      const newNonce = tx.auth.spendingCondition?.nonce.toNumber();
      const blockHeight = await snapshot.getPromise(latestBlockHeightStore);
      const network = await snapshot.getPromise(currentNetworkStore);
      const address = await snapshot.getPromise(currentAccountStxAddressStore);
      if (newNonce) {
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
      const { username } = account;
      if (NODE_ENV === 'test') {
        account.username = '';
      }
      const authResponse = await makeAuthResponse({
        gaiaHubUrl: gaiaUrl,
        appDomain: appURL.origin,
        transitPublicKey: decodedAuthRequest.public_keys[0],
        scopes: decodedAuthRequest.scopes,
        account,
      });
      account.username = username;
      set(currentAccountIndexStore, accountIndex);
      finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
    },
    [decodedAuthRequest, authRequest, appName, appIcon]
  );

  const doSaveAuthRequest = useCallback(
    async (authRequest: string) => {
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
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

  const doUnlockWallet = useCallback(
    async (password: string) => {
      if (!encryptedSecretKey) {
        throw new Error('Tried to unlock wallet when no encrypted key found.');
      }
      const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), password);
      setHasSetPassword(true);
      await doStoreSeed(secretKey, password);
    },
    [encryptedSecretKey, doStoreSeed, setHasSetPassword]
  );

  const doLockWallet = useRecoilCallback(
    ({ set }) => () => {
      set(walletStore, undefined);
      set(secretKeyStore, undefined);
    },
    []
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
    doMakeWallet,
    doStoreSeed,
    doCreateNewAccount,
    doSignOut,
    doFinishSignIn,
    doSaveAuthRequest,
    doSetPassword,
    doSetLatestNonce,
    doUnlockWallet,
    doLockWallet,
    setWallet,
  };
};
