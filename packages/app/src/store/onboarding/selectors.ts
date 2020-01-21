import { IAppState } from '..';

export const selectCurrentScreen = (state: IAppState) => state.onboarding.screen;

export const selectSecretKey = (state: IAppState) => state.onboarding.secretKey;

export const selectDecodedAuthRequest = (state: IAppState) => state.onboarding.decodedAuthRequest;

export const selectAuthRequest = (state: IAppState) => state.onboarding.authRequest;

export const selectAppName = (state: IAppState) => state.onboarding.appName;

export const selectAppIcon = (state: IAppState) => state.onboarding.appIcon;

export const selectMagicRecoveryCode = (state: IAppState) => state.onboarding.magicRecoveryCode;
