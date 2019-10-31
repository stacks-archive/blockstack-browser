import { DecodedAuthRequest } from '../../../dev/types'
export const AUTH_REQUEST = 'PERMISSIONS/AUTH_REQUEST'

export interface AuthRequestAction {
  type: typeof AUTH_REQUEST
  authRequest: string
  decodedAuthRequest: DecodedAuthRequest
}

export interface PermissionsState {
  authRequest: string | null
  decodedAuthRequest: DecodedAuthRequest | null
}

export type PermissionsActions = AuthRequestAction
