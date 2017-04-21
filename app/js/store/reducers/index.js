import { combineReducers } from 'redux'

import { AccountReducer }  from '../account'
import { AuthReducer }     from '../auth'
import { SettingsReducer } from '../../account/store/settings'
import { IdentityReducer } from '../identities'
import { SearchReducer }   from '../../profiles/store/search'

const RootReducer = combineReducers({
  account: AccountReducer,
  auth: AuthReducer,
  settings: SettingsReducer,
  identities: IdentityReducer,
  search: SearchReducer
})

export default RootReducer
