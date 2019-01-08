// @flow
import { combineReducers } from 'redux'
import { reducer as makeNotificationsReducer } from 'reapop'
import AccountReducer from '../account/store/account/reducer'
import { AuthReducer } from '../auth/store/auth'
import ProfilesReducer from '../profiles/store/reducers'
import { SanityReducer } from './sanity'
import SettingsReducer from '../account/store/settings/reducer'
import { AppsReducer } from './apps'
import { DELETE_ACCOUNT } from '../account/store/account/types'
import DEFAULT_API from '../account/store/settings/default'

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
export const CURRENT_VERSION: number = 17

const AppReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  apps: AppsReducer,
  profiles: ProfilesReducer,
  sanity: SanityReducer,
  settings: SettingsReducer,
  notifications: makeNotificationsReducer()
})

function reducer(state: any, action: any) {
  let newState: any = Object.assign({}, state)
  if (action.type === UPDATE_STATE) {
    const initialState = AppReducer(undefined, {})
    
    const preservedApiSettingsState = {
      gaiaHubUrl: state.settings.api.gaiaHubUrl,
      distinctEventId: state.settings.api.distinctEventId,
      hasDisabledEventTracking: state.settings.api.hasDisabledEventTracking
    }

    const newApiSettingsState = Object.assign(DEFAULT_API, preservedApiSettingsState)

    newState = Object.assign({}, initialState, {
      settings: {
        api: newApiSettingsState
      },
      account: Object.assign({}, initialState.account, {
        promptedForEmail: state.account.promptedForEmail,
        viewedRecoveryCode: state.account.viewedRecoveryCode,
        connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce
      })
    })
  }
  if (action.type === MIGRATE_API_ENDPOINTS) {
    const initialState = AppReducer(undefined, {})

    newState = Object.assign({}, initialState, {
      settings: {
        api: Object.assign({}, action.nextApi)
      },
      account: Object.assign({}, initialState.account, {
        promptedForEmail: state.account.promptedForEmail,
        viewedRecoveryCode: state.account.viewedRecoveryCode,
        connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce
      })
    })
  }
  if (action.type === DELETE_ACCOUNT) {
    const initialState = AppReducer(undefined, {})
    newState = Object.assign({}, initialState, {
      settings: {
        api: Object.assign({}, initialState.settings.api, {
          coreAPIPassword: state.settings.api.coreAPIPassword,
          logServerPort: state.settings.api.logServerPort,
          regTestMode: state.settings.api.regTestMode
        })
      },
      apps: {
        instanceIdentifier: null
      }
    })
  }
  return AppReducer(newState, action)
}

export default reducer
