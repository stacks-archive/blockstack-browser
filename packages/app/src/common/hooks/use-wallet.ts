import { useCallback } from 'react';
import { decrypt, Wallet, makeIdentity, encryptMnemonicFormatted } from '@stacks/keychain';
import { useRecoilValue, useRecoilState, useSetRecoilState, useRecoilCallback } from 'recoil';
import { useDispatch } from 'react-redux';
import { gaiaUrl } from '@common/constants';
import { bip32 } from 'bitcoinjs-lib';
import { currentNetworkKeyStore, currentNetworkStore, networksStore } from '@store/recoil/networks';
import {
  walletStore,
  currentIdentityIndexStore,
  currentIdentityStore,
  encryptedSecretKeyStore,
  secretKeyStore,
  hasSetPasswordStore,
  latestNoncesStore,
  identitiesStore,
} from '@store/recoil/wallet';

import { ChainID, StacksTransaction } from '@blockstack/stacks-transactions';
import { DEFAULT_PASSWORD, ScreenPaths } from '@store/onboarding/types';
import { mnemonicToSeed } from 'bip39';
import { useOnboardingState } from './use-onboarding-state';
import { finalizeAuthResponse } from '@common/utils';
import {
  doSetOnboardingPath,
  doSetOnboardingProgress,
  doChangeScreen,
  saveAuthRequest,
} from '@store/onboarding/actions';
import { doTrackScreenChange } from '@common/track';
import { AppManifest, DecodedAuthRequest } from '@common/dev/types';
import { decodeToken, verifyAuthRequest } from 'blockstack';
import { chainInfoStore } from '@store/recoil/api';
import { useLoadable } from '@common/hooks/use-loadable';

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri);
  const json: AppManifest = await res.json();
  return json;
};

export const useWallet = () => {
  const [wallet, setWallet] = useRecoilState(walletStore);
  const [secretKey, setSecretKey] = useRecoilState(secretKeyStore);
  const [encryptedSecretKey, setEncryptedSecretKey] = useRecoilState(encryptedSecretKeyStore);
  const [currentIdentityIndex, setCurrentIdentityIndex] = useRecoilState(currentIdentityIndexStore);
  const [hasSetPassword, setHasSetPassword] = useRecoilState(hasSetPasswordStore); // 🧐 setHasSetPassword 🤮
  const [identities, setIdentities] = useRecoilState(identitiesStore);
  const currentIdentity = useRecoilValue(currentIdentityStore);
  const networks = useRecoilValue(networksStore);
  const currentNetwork = useRecoilValue(currentNetworkStore);
  const currentNetworkKey = useRecoilValue(currentNetworkKeyStore);
  const chainInfo = useLoadable(chainInfoStore);
  const setLatestNonces = useSetRecoilState(
    latestNoncesStore([currentNetworkKey, currentIdentity?.getStxAddress() || ''])
  );
  const dispatch = useDispatch();
  const { decodedAuthRequest, authRequest, appName, appIcon, screen } = useOnboardingState();

  const firstIdentity = identities?.[0];
  const isSignedIn = !!wallet;

  const doMakeWallet = useCallback(async () => {
    const wallet = await Wallet.generate(DEFAULT_PASSWORD, ChainID.Mainnet);
    const secretKey = await decrypt(wallet.encryptedBackupPhrase, DEFAULT_PASSWORD);
    dispatch(doSetOnboardingProgress(true));
    setWallet(wallet);
    setIdentities(wallet.identities);
    setSecretKey(secretKey);
    setEncryptedSecretKey(wallet.encryptedBackupPhrase);
    setCurrentIdentityIndex(0);
  }, [
    setWallet,
    setSecretKey,
    setEncryptedSecretKey,
    setCurrentIdentityIndex,
    setIdentities,
    dispatch,
  ]);

  const doStoreSeed = useCallback(
    async (secretKey: string, password?: string) => {
      const wallet = await Wallet.restore(password || DEFAULT_PASSWORD, secretKey, ChainID.Mainnet);
      setWallet(wallet);
      setIdentities(wallet.identities);
      setSecretKey(secretKey);
      setEncryptedSecretKey(wallet.encryptedBackupPhrase);
      setCurrentIdentityIndex(0);
      if (password !== undefined) setHasSetPassword(true);
    },
    [
      setWallet,
      setSecretKey,
      setEncryptedSecretKey,
      setCurrentIdentityIndex,
      setIdentities,
      setHasSetPassword,
    ]
  );

  const doCreateNewIdentity = useRecoilCallback(({ snapshot, set }) => async () => {
    const secretKey = await snapshot.getPromise(secretKeyStore);
    const wallet = await snapshot.getPromise(walletStore);
    if (!secretKey || !wallet) {
      throw 'Unable to create a new identity - not logged in.';
    }
    const seed = await mnemonicToSeed(secretKey);
    const rootNode = bip32.fromSeed(seed);
    const index = wallet.identities.length;
    const identity = await makeIdentity(rootNode, index);
    set(walletStore, wallet);
    set(identitiesStore, [...wallet.identities, identity]);
    set(currentIdentityIndexStore, index);
  });

  const doSignOut = useCallback(() => {
    setWallet(undefined);
    setIdentities(undefined);
    setCurrentIdentityIndex(undefined);
    setSecretKey(undefined);
    setEncryptedSecretKey(undefined);
    setHasSetPassword(false);
  }, [
    setWallet,
    setCurrentIdentityIndex,
    setSecretKey,
    setEncryptedSecretKey,
    setHasSetPassword,
    setIdentities,
  ]);

  const doSetPassword = useCallback(
    async (password: string) => {
      if (!secretKey) {
        throw new Error('Cannot set password - not logged in.');
      }
      const { encryptedMnemonicHex } = await encryptMnemonicFormatted(secretKey, password);
      setEncryptedSecretKey(encryptedMnemonicHex);
      setHasSetPassword(true);
    },
    [secretKey, setEncryptedSecretKey, setHasSetPassword]
  );

  const doSetLatestNonce = useCallback(
    (tx: StacksTransaction) => {
      const newNonce = tx.auth.spendingCondition?.nonce.toNumber();
      if (newNonce && chainInfo.value) {
        setLatestNonces({
          blockHeight: chainInfo.value.stacks_tip_height,
          nonce: newNonce,
        });
      }
    },
    [chainInfo.value, setLatestNonces]
  );

  const doFinishSignIn = useCallback(
    async (identityIndex: number) => {
      if (!decodedAuthRequest || !authRequest || !identities || !wallet) {
        console.error('Uh oh! Finished onboarding without auth info.');
        return;
      }
      const appURL = new URL(decodedAuthRequest.redirect_uri);
      const currentIdentity = identities[identityIndex];
      await currentIdentity.refresh();
      const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
      await wallet.getOrCreateConfig({ gaiaConfig, skipUpload: true });
      await wallet.updateConfigWithAuth({
        identityIndex,
        gaiaConfig,
        app: {
          origin: appURL.origin,
          lastLoginAt: new Date().getTime(),
          scopes: decodedAuthRequest.scopes,
          appIcon: appIcon as string,
          name: appName as string,
        },
      });
      const { defaultUsername } = currentIdentity;
      if (NODE_ENV === 'test') {
        currentIdentity.defaultUsername = '';
      }
      const authResponse = await currentIdentity.makeAuthResponse({
        gaiaUrl,
        appDomain: appURL.origin,
        transitPublicKey: decodedAuthRequest.public_keys[0],
        scopes: decodedAuthRequest.scopes,
      });
      currentIdentity.defaultUsername = defaultUsername;
      finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
      setWallet(wallet);
      dispatch(doSetOnboardingPath(undefined));
      dispatch(doSetOnboardingProgress(false));
    },
    [appIcon, appName, dispatch, wallet, decodedAuthRequest, authRequest, identities, setWallet]
  );

  const doSaveAuthRequest = useCallback(
    async (authRequest: string) => {
      const isValidPayload = await verifyAuthRequest(authRequest);
      if (!isValidPayload) throw new Error('JWT auth token is not valid');
      const { payload } = decodeToken(authRequest);
      const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
      let appName = decodedAuthRequest.appDetails?.name;
      let appIcon = decodedAuthRequest.appDetails?.icon;

      if (!appName || !appIcon) {
        const appManifest = await loadManifest(decodedAuthRequest);
        appName = appManifest.name;
        appIcon = appManifest.icons[0].src as string;
      }

      const hasIdentities = identities && identities.length;
      if ((screen === ScreenPaths.GENERATION || screen === ScreenPaths.SIGN_IN) && hasIdentities) {
        doTrackScreenChange(ScreenPaths.CHOOSE_ACCOUNT, decodedAuthRequest);
        dispatch(doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT));
      } else {
        doTrackScreenChange(screen, decodedAuthRequest);
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
    },
    [dispatch, identities, screen]
  );

  const doUnlockWallet = useCallback(
    async (password: string) => {
      if (!encryptedSecretKey) {
        throw new Error('Tried to unlock wallet when no encrypted key found.');
      }
      const secretKey = await decrypt(Buffer.from(encryptedSecretKey, 'hex'), password);
      setHasSetPassword(true);
      await doStoreSeed(secretKey);
    },
    [encryptedSecretKey, doStoreSeed, setHasSetPassword]
  );

  const doLockWallet = useRecoilCallback(({ set }) => () => {
    set(walletStore, undefined);
    set(secretKeyStore, undefined);
  });

  return {
    identities,
    firstIdentity,
    wallet,
    secretKey,
    isSignedIn,
    currentIdentity,
    currentIdentityIndex,
    networks,
    currentNetwork,
    currentNetworkKey,
    encryptedSecretKey,
    hasSetPassword,
    doMakeWallet,
    doStoreSeed,
    doCreateNewIdentity,
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
