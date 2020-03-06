import { useSelector } from 'react-redux';
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

export const useWallet = () => {
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

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchSecretKey();
  }, [onboardingSecretKey]);

  return { identities, firstIdentity, wallet, secretKey, isRestoringWallet, isSignedIn };
};
