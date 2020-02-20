import { DecodedAuthRequest } from '../../common/dev/types';

export const CHANGE_PAGE = 'ONBOARDING/CHANGE_PAGE';
export const SAVE_KEY = 'ONBOARDING/SAVE_KEY';
export const SAVE_AUTH_REQUEST = 'ONBOARDING/SAVE_AUTH_REQUEST';
export const SET_MAGIC_RECOVERY_CODE = 'ONBOARDING/SET_MAGIC_RECOVERY_CODE';
export const SET_USERNAME = 'ONBOARDING/SET_USERNAME';

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

// Nice page names for Mark to see in Mixpanel
export const pageTrackingNameMap = {
  [ScreenName.CHOOSE_ACCOUNT]: 'Choose Account',
  [ScreenName.USERNAME]: 'Username',
  [ScreenName.GENERATION]: 'Generation',
  [ScreenName.SECRET_KEY]: 'Copy Secret Key',
  [ScreenName.SAVE_KEY]: 'Save Secret Key',
  [ScreenName.CONNECT_APP]: 'Connect App',
  [ScreenName.SIGN_IN]: 'Sign In',
  [ScreenName.RECOVERY_CODE]: 'Magic Recovery Code',
  [ScreenName.ADD_ACCOUNT]: ' Select Username',
  [ScreenName.REGISTRY_ERROR]: 'Username Registry Error',
};

export const titleNameMap = {
  [ScreenName.CHOOSE_ACCOUNT]: 'Choose account',
  [ScreenName.USERNAME]: 'Choose a username',
  [ScreenName.GENERATION]: 'Generating your Secret Key',
  [ScreenName.SECRET_KEY]: 'Your Secret Key',
  [ScreenName.SAVE_KEY]: 'Save your Secret Key',
  [ScreenName.CONNECT_APP]: 'Connect App',
  [ScreenName.SIGN_IN]: 'Sign in',
  [ScreenName.RECOVERY_CODE]: 'Enter your password',
  [ScreenName.ADD_ACCOUNT]: ' Select Username',
  [ScreenName.REGISTRY_ERROR]: 'Failed to register username',
};

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
  username?: string;
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

interface SetUsername {
  type: typeof SET_USERNAME;
  username: string;
}

export type OnboardingActions =
  | ChangePageAction
  | StoreSecretKey
  | SetMagicRecoveryCode
  | SaveAuthRequest
  | SetUsername;
