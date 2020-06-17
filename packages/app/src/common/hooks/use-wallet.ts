import { useSelector, useDispatch } from 'react-redux';
import {
  selectIdentities,
  selectCurrentWallet,
  selectFirstIdentity,
  selectIsRestoringWallet,
  selectIsSignedIn,
} from '@store/wallet/selectors';
import { selectSecretKey } from '@store/onboarding/selectors';
import { decrypt } from '@blockstack/keychain';
import { DEFAULT_PASSWORD } from '@store/onboarding/types';
import { useState, useEffect } from 'react';
import { doStoreSeed } from '@store/wallet';

export const useWallet = () => {
  const dispatch = useDispatch();
  const identities = useSelector(selectIdentities);
  const firstIdentity = useSelector(selectFirstIdentity);
  const wallet = useSelector(selectCurrentWallet);
  const onboardingSecretKey = useSelector(selectSecretKey);
  const isRestoringWallet = useSelector(selectIsRestoringWallet);
  const isSignedIn = useSelector(selectIsSignedIn);
  const [secretKey, setSecretKey] = useState(onboardingSecretKey);

  const fetchSecretKey = async () => {
    if (!secretKey && wallet) {
      const decryptedKey = await decrypt(wallet?.encryptedBackupPhrase, DEFAULT_PASSWORD);
      setSecretKey(decryptedKey);
    }
  };

  const updateSTXKeychain = async () => {
    if (wallet && !wallet.stacksPrivateKey) {
      const decryptedKey = await decrypt(wallet?.encryptedBackupPhrase, DEFAULT_PASSWORD);
      dispatch(doStoreSeed(decryptedKey, DEFAULT_PASSWORD));
    }
  };

  useEffect(() => {
    void fetchSecretKey();
  }, [onboardingSecretKey]);

  useEffect(() => {
    void updateSTXKeychain();
  }, []);

  return { identities, firstIdentity, wallet, secretKey, isRestoringWallet, isSignedIn };
};
