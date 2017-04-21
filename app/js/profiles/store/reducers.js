import { combineReducers } from 'redux'

import { IdentityReducer } from './identities'
import { PGPReducer }  from './pgp'
import { SearchReducer } from './search'

const ProfilesReducer = combineReducers({
  identities: IdentityReducer,
  pgp: PGPReducer,
  search: SearchReducer
})

export default ProfilesReducer
