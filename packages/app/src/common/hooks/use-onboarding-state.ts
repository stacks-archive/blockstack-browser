import { useSelector } from 'react-redux';
import {
  selectSecretKey,
  selectCurrentScreen,
  selectAuthRequest,
  selectDecodedAuthRequest,
  selectMagicRecoveryCode,
  selectOnboardingProgress,
  selectUsername,
  selectOnboardingPath,
} from '@store/onboarding/selectors';

export const useOnboardingState = () => {
  const secretKey = useSelector(selectSecretKey);
  const screen = useSelector(selectCurrentScreen);
  const authRequest = useSelector(selectAuthRequest);
  const decodedAuthRequest = useSelector(selectDecodedAuthRequest);
  const magicRecoveryCode = useSelector(selectMagicRecoveryCode);
  const isOnboardingInProgress = useSelector(selectOnboardingProgress);
  const username = useSelector(selectUsername);
  const onboardingPath = useSelector(selectOnboardingPath);

  return {
    secretKey,
    screen,
    authRequest,
    decodedAuthRequest,
    magicRecoveryCode,
    isOnboardingInProgress,
    username,
    onboardingPath,
  };
};
