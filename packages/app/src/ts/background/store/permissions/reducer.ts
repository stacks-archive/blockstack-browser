import { Reducer } from 'redux';
import { PermissionsActions, AUTH_REQUEST, PermissionsState } from './types';

const initialState: PermissionsState = {
  authRequest: null,
  decodedAuthRequest: null,
};

export const permissionsReducer: Reducer<
  PermissionsState,
  PermissionsActions
> = (state = initialState, action: PermissionsActions): PermissionsState => {
  switch (action.type) {
    case AUTH_REQUEST:
      return {
        ...state,
        authRequest: action.authRequest,
        decodedAuthRequest: action.decodedAuthRequest,
      };
    default:
      return state;
  }
};
