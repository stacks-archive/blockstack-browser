import { IAppState } from '@store';

export const selectCurrentScreen = (state: IAppState) => {
  return state.onboarding.screen;
};

export const selectSecretKey = (state: IAppState) => {
  return state.onboarding.secretKey;
};

export const selectDecodedAuthRequest = (state: IAppState) => {
  return state.onboarding.decodedAuthRequest;
};

export const selectAuthRequest = (state: IAppState) => {
  return state.onboarding.authRequest;
};

export const selectAppName = (state: IAppState) => {
  return state.onboarding.appName;
};

export const selectAppIcon = (state: IAppState) => {
  return state.onboarding.appIcon;
};

export const selectMagicRecoveryCode = (state: IAppState) => {
  return state.onboarding.magicRecoveryCode;
};
