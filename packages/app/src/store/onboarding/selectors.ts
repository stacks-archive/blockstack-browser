import { AppState } from '..';

export const selectCurrentScreen = (state: AppState) => state.onboarding.screen;

export const selectSecretKey = (state: AppState) => state.onboarding.secretKey;

export const selectDecodedAuthRequest = (state: AppState) => state.onboarding.decodedAuthRequest;

export const selectAuthRequest = (state: AppState) => state.onboarding.authRequest;

export const selectAppName = (state: AppState) => state.onboarding.appName;

export const selectAppIcon = (state: AppState) => state.onboarding.appIcon;

export const selectMagicRecoveryCode = (state: AppState) => state.onboarding.magicRecoveryCode;

export const selectUsername = (state: AppState) => state.onboarding.username;

export const selectAppURL = (state: AppState) => state.onboarding.appURL;

export const selectOnboardingProgress = (state: AppState) => state.onboarding.onboardingInProgress;

export const selectOnboardingPath = (state: AppState) => state.onboarding.onboardingPath;

/**
 * Select the fully qualified app icon. This allows developers to pass
 * a relative icon path in their `appDetails`.
 */
export const selectFullAppIcon = (state: AppState) => {
  let icon = selectAppIcon(state);
  const authRequest = selectDecodedAuthRequest(state);
  const absoluteURLPattern = /^https?:\/\//i;
  if (authRequest?.redirect_uri && icon && !absoluteURLPattern.test(icon)) {
    const url = new URL(authRequest.redirect_uri);
    url.pathname = icon;
    icon = url.toString();
  }
  return icon;
};
