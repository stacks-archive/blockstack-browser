import * as types from './types'
import { CHECKING_NAME_AVAILABILITY } from '../availability/types'

const initialState = {}

function RegistrationReducer(state = initialState, action) {
  switch (action.type) {
    // reset error on new name search
    case CHECKING_NAME_AVAILABILITY:
      return {
        ...state,
        error: null
      }
    case types.REGISTRATION_BEFORE_SUBMIT:
      return Object.assign({}, state, {
        profileUploading: false,
        registrationSubmitting: false,
        registrationSubmitted: false,
        error: null,
        preventRegistration: false
      })
    case types.REGISTRATION_SUBMITTING:
      return Object.assign({}, state, {
        profileUploading: false,
        registrationSubmitting: true,
        registrationSubmitted: false,
        error: null,
        preventRegistration: true
      })
    case types.REGISTRATION_SUBMITTED:
      return Object.assign({}, state, {
        profileUploading: false,
        registrationSubmitting: false,
        registrationSubmitted: true,
        error: null,
        preventRegistration: false
      })
    case types.REGISTRATION_ERROR:
      return Object.assign({}, state, {
        registrationSubmitting: false,
        error: action.error,
        preventRegistration: false,
        registrationSubmitted: false
      })
    case types.PROFILE_UPLOADING:
      return Object.assign({}, state, {
        profileUploading: true,
        error: null,
        preventRegistration: true
      })
    case types.PROFILE_UPLOAD_ERROR:
      return Object.assign({}, state, {
        profileUploading: false,
        error: action.error,
        preventRegistration: false
      })
    default:
      return state
  }
}

export default RegistrationReducer
