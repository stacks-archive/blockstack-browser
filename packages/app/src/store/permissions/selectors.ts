import { AppState } from '..';

export const selectAuthRequest = (state: AppState) => state.permissions.authRequest;

export const selectDecodedAuthRequest = (state: AppState) => state.permissions.decodedAuthRequest;
