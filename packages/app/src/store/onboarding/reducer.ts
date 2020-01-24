import { Reducer } from 'redux';
import {
  OnboardingActions,
  OnboardingState,
  CHANGE_PAGE,
  ScreenName,
  SAVE_KEY,
  SAVE_AUTH_REQUEST,
  SET_MAGIC_RECOVERY_CODE,
} from './types';

const initialState: OnboardingState = {
  screen: ScreenName.CREATE,
};

export const onboardingReducer: Reducer<OnboardingState, OnboardingActions> = (
  state = initialState,
  action: OnboardingActions
) => {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        screen: action.screen,
      };
    case SAVE_KEY:
      return {
        ...state,
        secretKey: action.secretKey,
      };
    case SAVE_AUTH_REQUEST:
      const newState = {
        ...state,
        authRequest: action.authRequest,
        decodedAuthRequest: action.decodedAuthRequest,
        appName: action.appName,
        appIcon: action.appIcon,
      };
      if (action.decodedAuthRequest.sendToSignIn) {
        newState.screen = ScreenName.SIGN_IN;
      }
      return newState;
    case SET_MAGIC_RECOVERY_CODE:
      return {
        ...state,
        magicRecoveryCode: action.magicRecoveryCode,
      };
    default:
      return state;
  }
};
