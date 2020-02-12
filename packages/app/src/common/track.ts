export const LANDING_SIGN_IN = 'clicked_sign_in_dv';
export const LANDING_TRY_WINK = 'clicked_try_data_vault';
export const LANDING_SIGN_IN_MODAL_CONTINUE = 'clicked_continue_with_data_vault';

export const SUBMIT_ABOUT_YOU = 'submitted_about_you_form';
export const SUBMIT_LOOKING_FOR = 'submitted_preferences_form';

export const INTRO_CLOSED = 'auth_new_closed_intro';
export const INTRO_CREATE = 'auth_new_created';
export const INTRO_SIGN_IN = 'auth_new_selected_sign_in_from_intro';
export const INTRO_HOW_WORKS = 'auth_new_selected_how_it_works_from_intro';

export const SECRET_KEY_INTRO_CLOSED = 'auth_new_closed_secret_key_intro';
export const SECRET_KEY_INTRO_COPIED = 'auth_new_copied_secret_key';

export const SECRET_KEY_INSTR_CLOSE = 'auth_new_closed_secret_key_instructions';
export const SECRET_KEY_INSTR_CONFIRMED = 'auth_new_confirmed_secret_key';

export const SECRET_KEY_FAQ_WHERE = 'auth_new_selected_secret_key_instruction_where';
export const SECRET_KEY_FAQ_LOSE = 'auth_new_selected_secret_key_instruction_lose';
export const SECRET_KEY_FAQ_WHEN = 'auth_new_selected_secret_key_instruction_when';
export const SECRET_KEY_FAQ_PASSWORD = 'auth_new_selected_secret_key_instruction_password';

export const CONNECT_CLOSED = 'auth_new_closed_secret_key_entry';
export const CONNECT_SAVED = 'auth_new_entered_correct_secret_key';
export const CONNECT_INCORRECT = 'auth_new_entered_incorrect_secret_key';
export const CONNECT_BACK = 'auth_new_retreated_secret_key_entry';

export const SIGN_IN_CLOSED = 'auth_existing_closed';
export const SIGN_IN_CORRECT = 'auth_existing_entered_correct_secret_key';
export const SIGN_IN_CREATE = 'auth_existing_create_data_vault'; // was not specified in wink app spec
export const SIGN_IN_FORGOT = 'auth_existing_forgot_secret_key'; // was not specified in wink app spec
export const SIGN_IN_INCORRECT = 'auth_existing_entered_incorrect_secret_key';

export const USERNAME_START = 'auth_username_start';
export const USERNAME_ENTERED = 'auth_username_entered';

export const ONBOARDING_SCREEN_CHANGED = 'auth_screen_changed';

export const doTrack = (type: string, payload?: string | object) => {
  console.log('Tracking:', { type, payload });
  window.analytics.track(type, payload);
};
