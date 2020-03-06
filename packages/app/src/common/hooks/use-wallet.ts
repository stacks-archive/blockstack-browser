import { useSelector } from 'react-redux';
import {
  selectIdentities,
  selectCurrentWallet,
  selectFirstIdentity,
  selectIsRestoringWallet,
  selectIsSignedIn,
} from '@store/wallet/selectors';
import { selectSecretKey } from '@store/onboarding/selectors';

export const useWallet = () => {
  const identities = useSelector(selectIdentities);
  const firstIdentity = useSelector(selectFirstIdentity);
  const wallet = useSelector(selectCurrentWallet);
  const secretKey = useSelector(selectSecretKey);
  const isRestoringWallet = useSelector(selectIsRestoringWallet);
  const isSignedIn = useSelector(selectIsSignedIn);

  return { identities, firstIdentity, wallet, secretKey, isRestoringWallet, isSignedIn };
};
