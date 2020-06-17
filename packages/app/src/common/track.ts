import { ScreenPaths } from '@store/onboarding/types';
import { DecodedAuthRequest } from './dev/types';
import { event, page, setConfig, Providers } from '@blockstack/stats';

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

export const TRANSACTION_SIGN_START = 'Start Transaction Sign Screen';
export const TRANSACTION_SIGN_SUBMIT = 'Submit Transaction Sign';
export const TRANSACTION_SIGN_ERROR = 'Fail Transaction Sign';

// Nice page names for Mark to see in Mixpanel
export const pageTrackingNameMap = {
  [ScreenPaths.CHOOSE_ACCOUNT]: 'Choose Account',
  [ScreenPaths.USERNAME]: 'Username',
  [ScreenPaths.GENERATION]: 'Generation',
  [ScreenPaths.SECRET_KEY]: 'Copy Secret Key',
  [ScreenPaths.SAVE_KEY]: 'Save Secret Key',
  [ScreenPaths.SIGN_IN]: 'Sign In',
  [ScreenPaths.RECOVERY_CODE]: 'Magic Recovery Code',
  [ScreenPaths.ADD_ACCOUNT]: ' Select Username',
  [ScreenPaths.REGISTRY_ERROR]: 'Username Registry Error',
  [ScreenPaths.SETTINGS_KEY]: 'Settings: Secret Key',
  [ScreenPaths.HOME]: 'App Home',
};

export const titleNameMap = {
  [ScreenPaths.CHOOSE_ACCOUNT]: 'Choose account',
  [ScreenPaths.USERNAME]: 'Choose a username',
  [ScreenPaths.GENERATION]: 'Generating your Secret Key',
  [ScreenPaths.SECRET_KEY]: 'Your Secret Key',
  [ScreenPaths.SAVE_KEY]: 'Save your Secret Key',
  [ScreenPaths.SIGN_IN]: 'Sign in',
  [ScreenPaths.RECOVERY_CODE]: 'Enter your password',
  [ScreenPaths.ADD_ACCOUNT]: ' Select Username',
  [ScreenPaths.REGISTRY_ERROR]: 'Failed to register username',
  [ScreenPaths.SETTINGS_KEY]: 'View your Secret Key',
  [ScreenPaths.HOME]: 'Secret Key',
};

export const doTrackScreenChange = (
  screen: ScreenPaths,
  decodedAuthRequest?: DecodedAuthRequest
) => {
  if (titleNameMap[screen]) {
    document.title = titleNameMap[screen];
  }
  const appURL = decodedAuthRequest ? new URL(decodedAuthRequest?.redirect_uri) : null;
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(async () => {
    await page({
      name: pageTrackingNameMap[screen],
      appName: decodedAuthRequest?.appDetails?.name,
      appDomain: appURL?.host,
    });
  }, 1);
};

export const doTrack = (type: string, payload?: object) => {
  console.log('Tracking:', { type, payload });
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  setTimeout(async () => {
    await event({
      name: type,
      ...payload,
    });
  }, 1);
};

export const setStatsConfig = () => {
  setConfig({
    useHash: true,
    host: STATS_URL,
    providers: [
      {
        name: Providers.Segment,
        writeKey: SEGMENT_KEY,
      },
    ],
  });
};
