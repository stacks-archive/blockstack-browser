import { decodeToken } from 'jsontokens';
import { PermissionsActions, AUTH_REQUEST } from './types';
import { DecodedAuthRequest } from '../../common/dev/types';

export const doAuthRequest = (authRequest: string): PermissionsActions => {
  const { payload } = decodeToken(authRequest);
  return {
    type: AUTH_REQUEST,
    authRequest,
    decodedAuthRequest: (payload as unknown) as DecodedAuthRequest,
  };
};
