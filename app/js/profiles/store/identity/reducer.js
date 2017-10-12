import * as types from './types'
import { DEFAULT_PROFILE } from '../../../utils/profile-utils'

const initialState = {
  default: 0,
  localIdentities: [],
  publicIdentities: {},
  nameTransfers: [],
  zoneFileUpdates: [],
  createProfileError: null
}

function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_PUBLIC_IDENTITY:
      return Object.assign({}, state, {
        publicIdentities: Object.assign({}, state.publicIdentities, {
          [action.username]: {
            username: action.username,
            ownerAddress: action.ownerAddress,
            zoneFile: action.zoneFile,
            profile: JSON.parse(JSON.stringify(action.profile)),
            verifications: JSON.parse(JSON.stringify(action.verifications))
          }
        })
      })
    case types.SET_DEFAULT:
      return Object.assign({}, state, {
        default: action.index
      })
    case types.CREATE_NEW:
      return Object.assign({}, state, {
        localIdentities: [...state.localIdentities, {
          username: null,
          usernameOwned: false,
          usernamePending: false,
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false,
          ownerAddress: action.ownerAddress,
          zoneFile: null
        }
      ]
      })
    case types.UPDATE_PROFILE: {
      const newLocalIdentities = state.localIdentities.slice()
      newLocalIdentities[action.index].profile = action.profile
      newLocalIdentities[action.index].zoneFile = action.zoneFile
      newLocalIdentities[action.index].verifications = action.verifications
      return Object.assign({}, state, {
        localIdentities: newLocalIdentities
      })
    }
    case types.UPDATE_SOCIAL_PROOF_VERIFICATIONS: {
      const newLocalIdentities = state.localIdentities.slice()
      newLocalIdentities[action.index].verifications =
      JSON.parse(JSON.stringify(action.verifications))
      return Object.assign({}, state, {
        localIdentities: newLocalIdentities
      })
    }
    case types.ADD_USERNAME: {
      const newLocalIdentities = state.localIdentities.slice()
      newLocalIdentities[action.index].username = action.username
      newLocalIdentities[action.index].usernamePending = true
      newLocalIdentities[action.index].usernameOwned = false
      return Object.assign({}, state, {
        localIdentities: newLocalIdentities
      })
    }
    case types.USERNAME_OWNED: {
      const newLocalIdentities = state.localIdentities.slice()
      newLocalIdentities[action.index].username = action.username
      newLocalIdentities[action.index].usernamePending = false
      newLocalIdentities[action.index].usernameOwned = true
      return Object.assign({}, state, {
        localIdentities: newLocalIdentities
      })
    }
    case types.NO_USERNAME_OWNED: {
      const newLocalIdentities = state.localIdentities.slice()
      if (newLocalIdentities[action.index].usernamePending) {
        // we've submitted a registration but never owned this name
        // do nothing
      } else {
        // we've owned this name in the past but it's likely
        // expired or been transferred away
        newLocalIdentities[action.index].usernameOwned = false
      }
      return Object.assign({}, state, {
        localIdentities: newLocalIdentities
      })
    }
    case types.RESET_CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: null
      })
    }
    case types.CREATE_PROFILE_ERROR: {
      return Object.assign({}, state, {
        createProfileError: `${action.error}`
      })
    }
    case types.BROADCASTING_ZONE_FILE_UPDATE: {
      let zoneFileUpdates = []
      if (state.zoneFileUpdates) {
        zoneFileUpdates = state.zoneFileUpdates
      }
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, zoneFileUpdates, {
          [action.domainName]: Object.assign({}, zoneFileUpdates[action.domainName], {
            broadcasting: true,
            error: null
          })
        })
      })
    }
    case types.BROADCASTED_ZONE_FILE_UPDATE:
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, state.zoneFileUpdates, {
          [action.domainName]: Object.assign({}, state.zoneFileUpdates[action.domainName], {
            broadcasting: false,
            error: null
          })
        })
      })
    case types.BROADCASTING_ZONE_FILE_UPDATE_ERROR:
      return Object.assign({}, state, {
        zoneFileUpdates: Object.assign({}, state.zoneFileUpdates, {
          [action.domainName]: Object.assign({}, state.zoneFileUpdates[action.domainName], {
            broadcasting: false,
            error: action.error
          })
        })
      })
    case types.BROADCASTING_NAME_TRANSFER: {
      let nameTransfers = []
      if (state.nameTransfers) {
        nameTransfers = state.nameTransfers
      }
      return Object.assign({}, state, {
        nameTransfers: Object.assign({}, nameTransfers, {
          [action.domainName]: Object.assign({}, nameTransfers[action.domainName], {
            broadcasting: true,
            error: null
          })
        })
      })
    }
    case types.BROADCASTED_NAME_TRANSFER:
      return Object.assign({}, state, {
        nameTransfers: Object.assign({}, state.nameTransfers, {
          [action.domainName]: Object.assign({}, state.nameTransfers[action.domainName], {
            broadcasting: false,
            error: null
          })
        })
      })
    case types.BROADCASTING_NAME_TRANSFER_ERROR:
      return Object.assign({}, state, {
        nameTransfers: Object.assign({}, state.nameTransfers, {
          [action.domainName]: Object.assign({}, state.nameTransfers[action.domainName], {
            broadcasting: false,
            error: action.error
          })
        })
      })
    default:
      return state
  }
}

export default IdentityReducer
