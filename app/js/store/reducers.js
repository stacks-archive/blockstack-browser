// @flow
import { combineReducers } from 'redux'
import { AccountReducer }  from '../account/store/account'
import { AuthReducer }     from '../auth/store/auth'
import ProfilesReducer from '../profiles/store/reducers'
import { SanityReducer } from './sanity'
import { SettingsReducer } from '../account/store/settings'
import { DELETE_ACCOUNT } from '../account/store/account/types'

const AppReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  profiles: ProfilesReducer,
  sanity: SanityReducer,
  settings: SettingsReducer
})

const RootReducer = (state: any, action: any) => {
  if (action.type === DELETE_ACCOUNT) {
    const initialState = AppReducer(undefined, {})
    state = Object.assign({}, initialState, {
      settings: {
        api: Object.assign({}, initialState.settings.api, {
          coreAPIPassword: state.settings.api.coreAPIPassword,
          logServerPort: state.settings.api.logServerPort
        })
      }
    })
  }
  return AppReducer(state, action)
}

export default RootReducer
