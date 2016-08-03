import { Person, makeZoneFileForHostedProfile } from 'blockstack-profiles'

const UPDATE_CURRENT = 'UPDATE_CURRENT',
      UPDATE_IDENTITIES = 'UPDATE_IDENTITIES',
      CREATE_NEW = 'CREATE_NEW',
      UPDATE_PROFILE = 'UPDATE_PROFILE'

function updateCurrentIdentity(domainName, profile, verifications) {
  return {
    type: UPDATE_CURRENT,
    domainName: domainName,
    profile: profile,
    verifications: verifications
  }
}

function createNewIdentity(domainName) {
  return {
    type: CREATE_NEW,
    domainName: domainName
  }
}

function updateOwnedIdentities(localIdentities) {
  return {
    type: UPDATE_IDENTITIES,
    localIdentities: localIdentities
  }
}

function updateProfile(index, profile) {
  return {
    type: UPDATE_PROFILE,
    index: index,
    profile: profile
  }
}

function calculateLocalIdentities(localIdentities, namesOwned) {
  let remoteNamesDict = {},
      localNamesDict = {},
      updatedLocalIdentities = localIdentities

  namesOwned.map(function(name) {
    remoteNamesDict[name] = true
  })

  localIdentities.map(function(identity) {
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.map(function(name) {
    if (!localNamesDict.hasOwnProperty(name)) {
      updatedLocalIdentities.push({
        index: updatedLocalIdentities.length,
        domainName: name,
        registered: true
      })
    }
  })

  return updatedLocalIdentities
}

function getIdentities(addresses, addressLookupUrl, localIdentities) {
  return dispatch => {
    if (addresses.length === 0) {
      let namesOwned = []
      let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)
      if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
        // pass
      } else {
        dispatch(updateOwnedIdentities(localIdentities, namesOwned))
      }
    } else {
      fetch(addressLookupUrl.replace('{address}', addresses.join(',')))
        .then((response) => response.text())
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          let namesOwned = []
          if (responseJson.hasOwnProperty('results')) {
            responseJson.results.map((addressResult) => {
              if (addressResult.hasOwnProperty('names')) {
                addressResult.names.map((name) => {
                  namesOwned.push(name)
                })
              }
            })
          }

          let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)

          if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
            // pass
          } else {
            dispatch(updateOwnedIdentities(localIdentities, namesOwned))
          }
        })
        .catch((error) => {
          console.warn(error)
        })
    }
  }
}

function registerName(domainName, recipientAddress, tokenFileUrl, registerUrl,
                      blockstackApiAppId, blockstackApiAppSecret) {
  return dispatch => {
    const zoneFile = makeZoneFileForHostedProfile(domainName, tokenFileUrl)
    fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(blockstackApiAppId + ':' + blockstackApiAppSecret)
      },
      body: JSON.stringify({
        username: domainName.split('.')[0],
        recipient_address: recipientAddress,
        profile: zoneFile
      })
    })
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        dispatch(createNewIdentity(domainName))
      })
      .catch((error) => {
        console.log(error)
      })
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
        const profile = responseJson[username]['profile'],
              verifications = responseJson[username]['verifications']
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
  fetchCurrentIdentity: fetchCurrentIdentity,
  getIdentities: getIdentities,
  updateOwnedIdentities: updateOwnedIdentities,
  registerName: registerName
}

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: [
  ]
}

export function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          domainName: action.domainName,
          profile: action.profile,
          verifications: action.verifications
        }
      })
    case CREATE_NEW:
      return Object.assign({}, state, {
        localIdentities: [
          ...state.localIdentities,
          {
            index: state.localIdentities.length,
            domainName: action.domainName,
            profile: {
              '@type': 'Person',
              '@context': 'http://schema.org'
            },
            verifications: [],
            registered: false
          }
        ]
      })
    case UPDATE_IDENTITIES:
      return Object.assign({}, state, {
        localIdentities: action.localIdentities
      })
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        localIdentities: [
          ...state.localIdentities.slice(0, action.index),
          Object.assign({}, state.localIdentities[action.index], {
            profile: action.profile
          }),
          ...state.localIdentities.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}

/*{
  index: 0,
  domainName: 'ryan.id',
  profile: {},
  verifications: [],
  registered: false,
  blockNumber: null,
  transactionNumber: null
}*/
