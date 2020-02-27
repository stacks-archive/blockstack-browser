import { ScreenName } from '@store/onboarding/types';
import { DecodedAuthRequest } from './dev/types';

export const SECRET_KEY_FAQ_WHERE = 'View Secret Key FAQ (Where)';
export const SECRET_KEY_FAQ_LOSE = 'View Secret Key FAQ (Lose)';
export const SECRET_KEY_FAQ_WHEN = 'View Secret Key FAQ (When)';
export const SECRET_KEY_FAQ_PASSWORD = 'View Secret Key FAQ (Password)';

export const SIGN_IN_CLOSED = 'Close Sign In';
export const SIGN_IN_CORRECT = 'Sign In';
export const SIGN_IN_INCORRECT = 'Fail Sign In';
export const CHOOSE_ACCOUNT_CHOSEN = 'Choose Account';
export const CHOOSE_ACCOUNT_REUSE_WARNING = 'View Account Choice Warning';
export const CHOOSE_ACCOUNT_REUSE_WARNING_DISABLED = 'Disable Account Choice Warning';
export const CHOOSE_ACCOUNT_REUSE_WARNING_CONTINUE = 'Confirm Account Choice';
export const CHOOSE_ACCOUNT_REUSE_WARNING_BACK = 'Decline Account Choice';
export const SIGN_IN_CREATE = 'Select Create From Sign In';
export const USERNAME_REGISTER_FAILED = 'Username Registration Failed';

export const USERNAME_SUBMITTED = 'Submit Username';
export const USERNAME_VALIDATION_ERROR = 'Validation Error Username';
export const USERNAME_SUBMIT_SUCCESS = 'Submit Username Success';

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

export const doTrackScreenChange = (screen: ScreenName, decodedAuthRequest: DecodedAuthRequest | undefined) => {
  document.title = titleNameMap[screen];
  const appURL = decodedAuthRequest ? new URL(decodedAuthRequest?.redirect_uri) : null;
  window.analytics.page(pageTrackingNameMap[screen], {
    appName: decodedAuthRequest?.appDetails?.name,
    appDomain: appURL?.host,
  });
};

export const doTrack = (type: string, payload?: string | object) => {
  console.log('Tracking:', { type, payload });
  window.analytics.track(type, payload);
};
