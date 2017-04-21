import { combineReducers } from 'redux'

import { AccountReducer }  from '../../account/store/account'
import { AuthReducer }     from '../../auth/store/auth'
import { SettingsReducer } from '../../account/store/settings'
import { IdentityReducer } from '../../profiles/store/identities'
import { SearchReducer }   from '../../profiles/store/search'

const RootReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  settings: SettingsReducer,
  identities: IdentityReducer,
  search: SearchReducer
})

export default RootReducer
