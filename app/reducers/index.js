import { combineReducers } from 'redux'

import counter from './counter'
import identities from './identities'
import keychain from './keychain'

const rootReducer = combineReducers({
  counter: counter,
  identities: identities,
  keychain: keychain
})

export default rootReducer
