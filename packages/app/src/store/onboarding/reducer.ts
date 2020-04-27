import { Reducer } from 'redux';
import {
  CHANGE_PAGE,
  ONBOARDING_PROGRESS,
  OnboardingActions,
  OnboardingState,
  SAVE_AUTH_REQUEST,
  SAVE_KEY,
  ScreenPaths,
  SET_MAGIC_RECOVERY_CODE,
  SET_USERNAME,
  SET_ONBOARDING_PATH,
} from './types';

export const initialState: OnboardingState = {
  screen: ScreenPaths.GENERATION,
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
        appURL: action.appURL,
      };
      if (action.decodedAuthRequest.sendToSignIn) {
        newState.screen = ScreenPaths.SIGN_IN;
      }
      return newState;
    case SET_MAGIC_RECOVERY_CODE:
      return {
        ...state,
        magicRecoveryCode: action.magicRecoveryCode,
      };
    case SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case ONBOARDING_PROGRESS:
      return {
        ...state,
        onboardingInProgress: action.payload,
      };
    case SET_ONBOARDING_PATH:
      return {
        ...state,
        onboardingPath: action.onboardingPath,
      };
    default:
      return state;
  }
};
