import { combineReducers } from 'redux'

import { AccountReducer }  from '../account/store/account'
import { AuthReducer }     from '../auth/store/auth'
import ProfilesReducer from '../profiles/store/reducers'
import { SettingsReducer } from '../account/store/settings'


const RootReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  profiles: ProfilesReducer,
  settings: SettingsReducer
})

export default RootReducer
