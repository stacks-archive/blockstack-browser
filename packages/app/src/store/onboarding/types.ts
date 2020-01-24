import { DecodedAuthRequest } from '../../common/dev/types';

export const CHANGE_PAGE = 'ONBOARDING/CHANGE_PAGE';
export const SAVE_KEY = 'ONBOARDING/SAVE_KEY';
export const SAVE_AUTH_REQUEST = 'ONBOARDING/SAVE_AUTH_REQUEST';
export const SET_MAGIC_RECOVERY_CODE = 'ONBOARDING/SET_MAGIC_RECOVERY_CODE';

export enum ScreenName {
  INTRO = 'screens/INTRO',
  HOW_IT_WORKS = 'screens/HOW_IT_WORKS',
  CREATE = 'screens/CREATE',
  SECRET_KEY = 'screens/SECRET_KEY',
  SAVE_KEY = 'screens/SAVE_KEY',
  CONNECT_APP = 'screens/CONNECT_APP',
  CONNECTED = 'screens/CONNECTED',
  SIGN_IN = 'screens/SIGN_IN',
  RECOVERY_CODE = 'screens/RECOVERY_CODE',
}

// TODO: clarify usage of password for local key encryption
export const DEFAULT_PASSWORD = 'password';

export interface OnboardingState {
  screen: ScreenName;
  secretKey?: string;
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  magicRecoveryCode?: string;
}

interface ChangePageAction {
  type: typeof CHANGE_PAGE;
  screen: ScreenName;
}

interface StoreSecretKey {
  type: typeof SAVE_KEY;
  secretKey: string;
}

interface SaveAuthRequest {
  type: typeof SAVE_AUTH_REQUEST;
  appName: string;
  appIcon: string;
  decodedAuthRequest: DecodedAuthRequest;
  authRequest: string;
}

interface SetMagicRecoveryCode {
  type: typeof SET_MAGIC_RECOVERY_CODE;
  magicRecoveryCode: string;
}

export type OnboardingActions = ChangePageAction | StoreSecretKey | SetMagicRecoveryCode | SaveAuthRequest;
