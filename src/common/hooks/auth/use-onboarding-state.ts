import {
  authRequestState,
  currentScreenState,
  magicRecoveryCodeState,
  onboardingPathState,
  onboardingProgressState,
  secretKeyState,
  usernameState,
} from '@store/onboarding';
import { useAtomValue } from 'jotai/utils';

export const useOnboardingState = () => {
  const secretKey = useAtomValue(secretKeyState);
  const screen = useAtomValue(currentScreenState);

  const { authRequest, decodedAuthRequest, appName, appIcon, appURL } =
    useAtomValue(authRequestState);

  const magicRecoveryCode = useAtomValue(magicRecoveryCodeState);
  const isOnboardingInProgress = useAtomValue(onboardingProgressState);
  const username = useAtomValue(usernameState);
  const onboardingPath = useAtomValue(onboardingPathState);

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
