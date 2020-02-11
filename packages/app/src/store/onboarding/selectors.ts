import { AppState } from '..';

export const selectCurrentScreen = (state: AppState) => state.onboarding.screen;

export const selectSecretKey = (state: AppState) => state.onboarding.secretKey;

export const selectDecodedAuthRequest = (state: AppState) => state.onboarding.decodedAuthRequest;

export const selectAuthRequest = (state: AppState) => state.onboarding.authRequest;

export const selectAppName = (state: AppState) => state.onboarding.appName;

export const selectAppIcon = (state: AppState) => state.onboarding.appIcon;

export const selectMagicRecoveryCode = (state: AppState) => state.onboarding.magicRecoveryCode;

export const selectUsername = (state: AppState) => state.onboarding.username;
