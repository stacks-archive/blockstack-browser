// @flow
import { combineReducers } from 'redux'
import { AccountReducer } from '../account/store/account'
import { AuthReducer } from '../auth/store/auth'
import ProfilesReducer from '../profiles/store/reducers'
import { SanityReducer } from './sanity'
import { SettingsReducer } from '../account/store/settings'
import { AppsReducer } from './apps'
import { DELETE_ACCOUNT } from '../account/store/account/types'

export const UPDATE_STATE = 'UPDATE_STATE'
export const MIGRATE_API_ENDPOINTS = 'MIGRATE_API_ENDPOINTS'
export const INIT_STATE_VERSION = 'INIT_STATE_VERSION'

export function updateState() {
  return {
    type: UPDATE_STATE
  }
}

export function migrateAPIEndpoints(nextApi: any) {
  return {
    type: MIGRATE_API_ENDPOINTS,
    nextApi
  }
}

export function initializeStateVersion() {
  console.log('initializeStateVersion')
  return {
    type: INIT_STATE_VERSION
  }
}
/**
 * Incrementing this triggers an upgrade process
 * where the user has to enter their password, critical state is migrated
 * and other state is regenerated.
 * @type {number}
 */
export const CURRENT_VERSION: number = 14


const AppReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  apps: AppsReducer,
  profiles: ProfilesReducer,
  sanity: SanityReducer,
  settings: SettingsReducer
})

const RootReducer = (state: any, action: any) => {
  const initialState = AppReducer(undefined, {})
  switch (action.type) {
    case UPDATE_STATE:
      return AppReducer(
        {
          ...initialState,
          settings: {
            api: { ...state.settings.api }
          },
          account: {
            ...initialState.account,
            encryptedBackupPhrase: state.account.encryptedBackupPhrase,
            promptedForEmail: state.account.promptedForEmail,
            viewedRecoveryCode: state.account.viewedRecoveryCode,
            connectedStorageAtLeastOnce:
              state.account.connectedStorageAtLeastOnce
          }
        },
        action
      )
    case MIGRATE_API_ENDPOINTS:
      return AppReducer(
        {
          ...initialState,
          settings: {
            api: { ...action.nextApi }
          },
          account: {
            ...initialState.account,
            encryptedBackupPhrase: state.account.encryptedBackupPhrase,
            promptedForEmail: state.account.promptedForEmail,
            viewedRecoveryCode: state.account.viewedRecoveryCode,
            connectedStorageAtLeastOnce:
              state.account.connectedStorageAtLeastOnce
          }
        },
        action
      )
    case DELETE_ACCOUNT:
      return AppReducer(
        {
          ...initialState,
          settings: {
            api: {
              ...initialState.settings.api,
              coreAPIPassword: state.settings.api.coreAPIPassword,
              logServerPort: state.settings.api.logServerPort,
              regTestMode: state.settings.api.regTestMode
            }
          },
          apps: {
            instanceIdentifier: null
          }
        },
        action
      )
    default:
      return AppReducer(state, action)
  }
}

export default RootReducer
