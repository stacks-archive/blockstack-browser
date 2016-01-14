import { combineReducers } from 'redux'

import identities from './identities'
import keychain from './keychain'

const rootReducer = combineReducers({
  identities: identities,
  keychain: keychain
})

export default rootReducer
