import { combineReducers } from 'redux'

import { AccountReducer }  from '../account'
import { AuthReducer }     from '../auth'
import { SettingsReducer } from '../settings'
import { IdentityReducer } from '../identities'
import { SearchReducer }   from '../search/index'

const RootReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  settings: SettingsReducer,
  identities: IdentityReducer,
  search: SearchReducer
})

export default RootReducer
