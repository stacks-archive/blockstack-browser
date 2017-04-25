import { combineReducers } from 'redux'

import { AvailabilityReducer } from './availability'
import { IdentityReducer } from './identity'
import { PGPReducer }  from './pgp'
import { RegistrationReducer } from './registration'
import { SearchReducer } from './search'


const ProfilesReducer = combineReducers({
  availability: AvailabilityReducer,
  identity: IdentityReducer,
  pgp: PGPReducer,
  registration: RegistrationReducer,
  search: SearchReducer
})

export default ProfilesReducer
