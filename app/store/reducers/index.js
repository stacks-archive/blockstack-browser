import { combineReducers } from 'redux'

import { IdentityReducer } from '../identities'
import { KeychainReducer } from '../keychain'
import { SettingsReducer } from '../settings'
import { SearchReducer }   from '../search'

const RootReducer = combineReducers({
  identities: IdentityReducer,
  keychain: KeychainReducer,
  settings: SettingsReducer,
  search: SearchReducer
})

export default RootReducer
