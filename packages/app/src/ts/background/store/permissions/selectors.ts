import { IAppState } from '@store'

export const selectAuthRequest = (state: IAppState) => state.permissions.authRequest

export const selectDecodedAuthRequest = (state: IAppState) => state.permissions.decodedAuthRequest
