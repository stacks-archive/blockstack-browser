import { useRecoilValue } from 'recoil';
import {
  authRequestState,
  currentScreenState,
  magicRecoveryCodeState,
  onboardingPathState,
  onboardingProgressState,
  secretKeyState,
  usernameState,
} from '@store/onboarding';

export const useOnboardingState = () => {
  const secretKey = useRecoilValue(secretKeyState);
  const screen = useRecoilValue(currentScreenState);

  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } =
    useRecoilValue(authRequestState);

  const magicRecoveryCode = useRecoilValue(magicRecoveryCodeState);
  const isOnboardingInProgress = useRecoilValue(onboardingProgressState);
  const username = useRecoilValue(usernameState);
  const onboardingPath = useRecoilValue(onboardingPathState);

  return {
    secretKey,
    screen,
    authRequest,
    decodedAuthRequest,
    magicRecoveryCode,
    isOnboardingInProgress,
    username,
    onboardingPath,
    appIcon,
    appName,
    appURL,
  };
};
