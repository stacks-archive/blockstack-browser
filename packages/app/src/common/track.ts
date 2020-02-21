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

export const doTrack = (type: string, payload?: string | object) => {
  console.log('Tracking:', { type, payload });
  window.analytics.track(type, payload);
};
