import { Person, flattenObject } from 'blockchain-profile'

const UPDATE_CURRENT = 'UPDATE_CURRENT',
      CREATE_NEW = 'CREATE_NEW',
      UPDATE_PROFILE = 'UPDATE_PROFILE'

function updateCurrentIdentity(id, profile, verifications) {
  return {
    type: UPDATE_CURRENT,
    id: id,
    profile: profile,
    verifications: verifications
  }
}

function createNewIdentity(id) {
  return {
    type: CREATE_NEW,
    id: id
  }
}

function updateProfile(index, profile) {
  return {
    type: UPDATE_PROFILE,
    index: index,
    profile: profile
  }
}

function fetchCurrentIdentity(domainName, lookupUrl) {
  return dispatch => {
    const username = domainName.replace('.id', ''),
          url = lookupUrl.replace('{name}', username)
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        const legacyProfile = responseJson[username]['profile'],
              verifications = responseJson[username]['verifications'],
              profile = Person.fromLegacyFormat(legacyProfile).profile
        dispatch(updateCurrentIdentity(domainName, profile, verifications))
      })
      .catch((error) => {
        console.warn(error)
      })
  }
}

export const IdentityActions = {
  updateCurrentIdentity: updateCurrentIdentity,
  createNewIdentity: createNewIdentity,
  updateProfile: updateProfile,
  fetchCurrentIdentity: fetchCurrentIdentity
}

const initialState = {
  current: {
    id: null,
    profile: null,
    verifications: null,
    blockNumber: null,
    transactionNumber: null
  },
  local: [
  ],
  registered: []
}

export function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          id: action.id,
          profile: action.profile,
          verifications: action.verifications
        }
      })
    case CREATE_NEW:
      return Object.assign({}, state, {
        local: [
          ...state.local,
          {
            index: state.local.length,
            id: action.id,
            profile: {},
            verifications: [],
            registered: false
          }
        ]
      })
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        local: [
          ...state.local.slice(0, action.index),
          Object.assign({}, state.local[action.index], {
            profile: action.profile
          }),
          ...state.local.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}

/*{
  index: 0,
  id: 'ryan.id',
  profile: {},
  verifications: [],
  registered: false,
  blockNumber: null,
  transactionNumber: null
}*/