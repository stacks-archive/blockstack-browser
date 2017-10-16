// @flow
import { combineReducers } from 'redux'
import { AccountReducer }  from '../account/store/account'
import { AuthReducer }     from '../auth/store/auth'
import ProfilesReducer from '../profiles/store/reducers'
import { SanityReducer } from './sanity'
import { SettingsReducer } from '../account/store/settings'
import { DELETE_ACCOUNT } from '../account/store/account/types'

// export const persistedStatePaths = [
//   'account',
//   'settings'
// ]

export const UPDATE_STATE = 'UPDATE_STATE'

export function updateState() {
  return {
    type: UPDATE_STATE
  }
}
/**
 * Incrementing this triggers an upgrade process
 * where the user has to enter their password, critical state is migrated
 * and other state is regenerated.
 * @type {number}
 */
const CURRENT_VERSION: number = 1

const versionInitialState = {
  number: CURRENT_VERSION
}

function VersionReducer(state = versionInitialState, action) {
  return state
}

const AppReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  profiles: ProfilesReducer,
  sanity: SanityReducer,
  settings: SettingsReducer,
  version: VersionReducer
})

const RootReducer = (state: any, action: any) => {
  let newState: any = Object.assign({}, state)
  if (action.type === UPDATE_STATE) {
    const initialState = AppReducer(undefined, {})
    newState = Object.assign({}, initialState, {
      settings: {
        api: Object.assign({}, state.settings.api)
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
          logServerPort: state.settings.api.logServerPort
        })
      }
    })
  }
  return AppReducer(newState, action)
}

export default RootReducer
