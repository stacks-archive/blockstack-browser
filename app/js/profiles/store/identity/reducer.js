import * as types from './types'
import { DEFAULT_PROFILE } from '../../../utils/profile-utils'

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  namesOwned: [],
  createProfileError: null
}

function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          domainName: action.domainName,
          profile: action.profile,
          verifications: action.verifications
        }
      })
    case types.CREATE_NEW:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: {
            domainName: action.domainName,
            profile: DEFAULT_PROFILE,
            verifications: [],
            registered: false,
            ownerAddress: action.ownerAddress
          }
        })
      })
    case types.UPDATE_IDENTITIES:
      return Object.assign({}, state, {
        localIdentities: action.localIdentities,
        namesOwned: action.namesOwned
      })
    case types.UPDATE_PROFILE:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: Object.assign({}, state.localIdentities[action.domainName], {
            profile: action.profile
          })
        })
      })
    case types.ADD_USERNAME: {
      const localIdentitiesCopy = Object.assign({}, state.localIdentities, {
        [action.domainName]: Object.assign({}, state.localIdentities[action.ownerAddress], {
          domainName: action.domainName
        })
      })
      delete localIdentitiesCopy[action.ownerAddress]
      return Object.assign({}, state, {
        localIdentities: localIdentitiesCopy
      })
    }
    case types.RESET_CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: null
      })
    }
    case types.CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: new String(action.error)
      })
    }
    default:
      return state
  }
}

export default IdentityReducer
