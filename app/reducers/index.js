import { combineReducers } from 'redux'
import counter from './counter'
import identities from './identities'

const rootReducer = combineReducers({
  counter,
  identities
})

export default rootReducer
