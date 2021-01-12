import { DecodedAuthRequest } from '@common/dev/types';

export const ONBOARDING_PROGRESS = 'ONBOARDING/ONBOARDING_PROGRESS';
export const CHANGE_PAGE = 'ONBOARDING/CHANGE_PAGE';
export const SAVE_KEY = 'ONBOARDING/SAVE_KEY';
export const SAVE_AUTH_REQUEST = 'ONBOARDING/SAVE_AUTH_REQUEST';
export const SET_MAGIC_RECOVERY_CODE = 'ONBOARDING/SET_MAGIC_RECOVERY_CODE';
export const SET_USERNAME = 'ONBOARDING/SET_USERNAME';
export const SET_ONBOARDING_PATH = 'ONBOARDING/SET_ONBOARDING_PATH';

export enum ScreenName {
  CHOOSE_ACCOUNT = 'screens/CHOOSE_ACCOUNT',
  USERNAME = 'screens/USERNAME',
  GENERATION = 'screens/GENERATION',
  SECRET_KEY = 'screens/SECRET_KEY',
  SAVE_KEY = 'screens/SAVE_KEY',
  CONNECT_APP = 'screens/CONNECT_APP',
  SIGN_IN = 'screens/SIGN_IN',
  RECOVERY_CODE = 'screens/RECOVERY_CODE',
  ADD_ACCOUNT = 'screens/ADD_ACCOUNT',
  REGISTRY_ERROR = 'screens/REGISTRY_ERROR',
}

export enum ScreenPaths {
  GENERATION = '/sign-up',
  SECRET_KEY = '/sign-up/secret-key',
  SETTINGS_KEY = '/settings/secret-key',
  SAVE_KEY = '/sign-up/save-secret-key',
  ONBOARDING_PASSWORD = '/sign-up/set-password',
  USERNAME = '/username',
  SIGN_IN = '/sign-in',
  RECOVERY_CODE = '/sign-in/recover',
  ADD_ACCOUNT = '/sign-in/add-account',
  CHOOSE_ACCOUNT = '/connect/choose-account',
  REGISTRY_ERROR = '/username-error',
  HOME = '/',
  INSTALLED = '/',
  SIGN_IN_INSTALLED = '/installed/sign-in',
  SIGN_UP_INSTALLED = '/installed/sign-up',
  SET_PASSWORD = '/set-password',
  POPUP_HOME = '/',
  POPUP_SEND = '/send',
  POPUP_RECEIVE = '/receive',
  ADD_NETWORK = '/add-network',
  EDIT_POST_CONDITIONS = '/transaction/post-conditions',
  TRANSACTION_POPUP = '/transaction',
}

export const persistedScreens = [
  ScreenPaths.SECRET_KEY,
  ScreenPaths.SAVE_KEY,
  ScreenPaths.ONBOARDING_PASSWORD,
  ScreenPaths.USERNAME,
];

// TODO: clarify usage of password for local key encryption
export const DEFAULT_PASSWORD = 'password';

export interface OnboardingState {
  screen: ScreenPaths;
  secretKey?: string;
  authRequest?: string;
  decodedAuthRequest?: DecodedAuthRequest;
  appName?: string;
  appIcon?: string;
  appURL?: URL;
  magicRecoveryCode?: string;
  username?: string;
  onboardingInProgress?: boolean;
  onboardingPath?: ScreenPaths;
}

interface OnboardingProgressAction {
  type: typeof ONBOARDING_PROGRESS;
  payload: boolean;
}

interface ChangePageAction {
  type: typeof CHANGE_PAGE;
  screen: ScreenPaths;
}

interface StoreSecretKey {
  type: typeof SAVE_KEY;
  secretKey: string;
}

interface SaveAuthRequest {
  type: typeof SAVE_AUTH_REQUEST;
  appName: string;
  appIcon: string;
  appURL: URL;
  decodedAuthRequest: DecodedAuthRequest;
  authRequest: string;
}

interface SetMagicRecoveryCode {
  type: typeof SET_MAGIC_RECOVERY_CODE;
  magicRecoveryCode: string;
}

interface SetUsername {
  type: typeof SET_USERNAME;
  username: string;
}

interface SetOnboardingPath {
  type: typeof SET_ONBOARDING_PATH;
  onboardingPath?: ScreenPaths;
}

export type OnboardingActions =
  | OnboardingProgressAction
  | ChangePageAction
  | StoreSecretKey
  | SetMagicRecoveryCode
  | SaveAuthRequest
  | SetOnboardingPath
  | SetUsername;
