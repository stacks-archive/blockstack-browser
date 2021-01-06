import {
  OnboardingActions,
  CHANGE_PAGE,
  ONBOARDING_PROGRESS,
  ScreenPaths,
  SAVE_KEY,
  SAVE_AUTH_REQUEST,
  SET_MAGIC_RECOVERY_CODE,
  SET_USERNAME,
  SET_ONBOARDING_PATH,
} from './types';
import { DecodedAuthRequest } from '../../common/dev/types';

export const doSetOnboardingProgress = (status: boolean): OnboardingActions => {
  return {
    type: ONBOARDING_PROGRESS,
    payload: status,
  };
};
export const doChangeScreen = (screen: ScreenPaths): OnboardingActions => {
  return {
    type: CHANGE_PAGE,
    screen,
  };
};

export const doSaveSecretKey = (secretKey: string): OnboardingActions => ({
  type: SAVE_KEY,
  secretKey,
});

export const doSetMagicRecoveryCode = (magicRecoveryCode: string): OnboardingActions => ({
  type: SET_MAGIC_RECOVERY_CODE,
  magicRecoveryCode,
});

export const doSetUsername = (username: string): OnboardingActions => ({
  type: SET_USERNAME,
  username,
});

export const doSetOnboardingPath = (onboardingPath?: ScreenPaths): OnboardingActions => ({
  type: SET_ONBOARDING_PATH,
  onboardingPath,
});

interface SaveAuthRequestParams {
  appName: string;
  appIcon: string;
  decodedAuthRequest: DecodedAuthRequest;
  authRequest: string;
  appURL: URL;
}

export const saveAuthRequest = ({
  appName,
  appIcon,
  decodedAuthRequest,
  authRequest,
  appURL,
}: SaveAuthRequestParams): OnboardingActions => {
  return {
    type: SAVE_AUTH_REQUEST,
    appName,
    appIcon,
    decodedAuthRequest,
    authRequest,
    appURL,
  };
};
