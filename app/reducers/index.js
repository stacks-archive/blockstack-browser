import { combineReducers } from 'redux'

import counter from './counter'
import identities from './identities'

const rootReducer = combineReducers({
  counter: counter,
  identities: identities
})

export default rootReducer
