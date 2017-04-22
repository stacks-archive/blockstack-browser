import { combineReducers } from 'redux'

import { IdentityReducer } from './identities'
import { PGPReducer }  from './pgp'
import { RegistrationReducer } from './registration'
import { SearchReducer } from './search'


const ProfilesReducer = combineReducers({
  identities: IdentityReducer,
  pgp: PGPReducer,
  registration: RegistrationReducer,
  search: SearchReducer
})

export default ProfilesReducer
