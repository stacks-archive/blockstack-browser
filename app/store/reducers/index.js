import { combineReducers } from 'redux'

import { IdentityReducer } from '../identities'
import { KeychainReducer } from '../keychain'
import { SettingsReducer } from '../settings'

const RootReducer = combineReducers({
  identities: IdentityReducer,
  keychain: KeychainReducer,
  settings: SettingsReducer
})

export default RootReducer
