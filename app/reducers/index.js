import { combineReducers } from 'redux'

import identities from './identities'
import keychain from './keychain'
import settings from './settings'

const rootReducer = combineReducers({
  identities: identities,
  keychain: keychain,
  settings: settings
})

export default rootReducer
