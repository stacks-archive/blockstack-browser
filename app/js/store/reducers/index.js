import { combineReducers } from 'redux'

import { AccountReducer } from '../account'
import { SettingsReducer } from '../settings'
import { IdentityReducer } from '../identities'
import { SearchReducer }   from '../search'

const RootReducer = combineReducers({
  account: AccountReducer,
  settings: SettingsReducer,
  identities: IdentityReducer,
  search: SearchReducer
})

export default RootReducer
