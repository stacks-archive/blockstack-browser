const LANDING_SIGN_IN = 'clicked_sign_in_dv';
const LANDING_TRY_WINK = 'clicked_try_data_vault';
const LANDING_SIGN_IN_MODAL_CONTINUE = 'clicked_continue_with_data_vault';

const SUBMIT_ABOUT_YOU = 'submitted_about_you_form';
const SUBMIT_LOOKING_FOR = 'submitted_preferences_form';

const INTRO_CLOSED = 'auth_new_closed_intro';
const INTRO_CREATE = 'auth_new_created';
const INTRO_SIGN_IN = 'auth_new_selected_sign_in_from_intro';
const INTRO_HOW_WORKS = 'auth_new_selected_how_it_works_from_intro';

const SECRET_KEY_INTRO_CLOSED = 'auth_new_closed_secret_key_intro';
const SECRET_KEY_INTRO_COPIED = 'auth_new_copied_secret_key';

const SECRET_KEY_INSTR_CLOSE = 'auth_new_closed_secret_key_instructions';
const SECRET_KEY_INSTR_CONFIRMED = 'auth_new_confirmed_secret_key';

const SECRET_KEY_FAQ_WHERE = 'auth_new_selected_secret_key_instruction_where';
const SECRET_KEY_FAQ_LOSE = 'auth_new_selected_secret_key_instruction_lose';
const SECRET_KEY_FAQ_WHEN = 'auth_new_selected_secret_key_instruction_when';
const SECRET_KEY_FAQ_PASSWORD = 'auth_new_selected_secret_key_instruction_password';

const CONNECT_CLOSED = 'auth_new_closed_secret_key_entry';
const CONNECT_SAVED = 'auth_new_entered_correct_secret_key';
const CONNECT_INCORRECT = 'auth_new_entered_incorrect_secret_key';
const CONNECT_BACK = 'auth_new_retreated_secret_key_entry';

const SIGN_IN_CLOSED = 'auth_existing_closed';
const SIGN_IN_CORRECT = 'auth_existing_entered_correct_secret_key';
const SIGN_IN_CREATE = 'auth_existing_create_data_vault'; // was not specified in wink app spec
const SIGN_IN_FORGOT = 'auth_existing_forgot_secret_key'; // was not specified in wink app spec
const SIGN_IN_INCORRECT = 'auth_existing_entered_incorrect_secret_key';

const USERNAME_START = 'auth_username_start';
const USERNAME_ENTERED = 'auth_username_entered';

const ONBOARDING_SCREEN_CHANGED = 'auth_screen_changed';

const doTrack = (type: string, payload?: string | object) => {
  console.log('Tracking:', { type, payload });
  window.analytics.track(type, payload);
};

export {
  doTrack,
  LANDING_SIGN_IN,
  LANDING_TRY_WINK,
  LANDING_SIGN_IN_MODAL_CONTINUE,
  SUBMIT_ABOUT_YOU,
  SUBMIT_LOOKING_FOR,
  INTRO_CLOSED, // TODO: build in ability to pass tracking fn to modal close action
  INTRO_CREATE,
  INTRO_SIGN_IN,
  INTRO_HOW_WORKS,
  SECRET_KEY_INTRO_CLOSED, // TODO: build in ability to pass tracking fn to modal close action
  SECRET_KEY_INTRO_COPIED,
  SECRET_KEY_INSTR_CLOSE, // TODO: build in ability to pass tracking fn to modal close action
  SECRET_KEY_INSTR_CONFIRMED,
  SECRET_KEY_FAQ_WHERE,
  SECRET_KEY_FAQ_LOSE,
  SECRET_KEY_FAQ_WHEN,
  SECRET_KEY_FAQ_PASSWORD,
  CONNECT_CLOSED, // TODO: build in ability to pass tracking fn to modal close action
  CONNECT_SAVED,
  CONNECT_INCORRECT,
  CONNECT_BACK,
  SIGN_IN_CLOSED, // TODO: build in ability to pass tracking fn to modal close action
  SIGN_IN_CREATE,
  SIGN_IN_CORRECT,
  SIGN_IN_FORGOT,
  SIGN_IN_INCORRECT,
  USERNAME_START,
  USERNAME_ENTERED,
  ONBOARDING_SCREEN_CHANGED,
};
