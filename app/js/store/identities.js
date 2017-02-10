import { Person } from 'blockstack-profiles'
import { parseZoneFile } from 'blockstack-zones'
import {
  makeZoneFileForHostedProfile, resolveZoneFileToProfile
} from '../utils/index'
import {
  validateProofs
} from 'blockstack-proofs'

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

function updateOwnedIdentities(localIdentities, namesOwned) {
  return {
    type: UPDATE_IDENTITIES,
    localIdentities: localIdentities,
    namesOwned: namesOwned
  }
}

function updateProfile(domainName, profile) {
  return {
    type: UPDATE_PROFILE,
    domainName: domainName,
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

  Object.keys(updatedLocalIdentities).forEach((name) => {
    let identity = updatedLocalIdentities[name]
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.map(function(name) {
    if (!localNamesDict.hasOwnProperty(name)) {
      updatedLocalIdentities[name] = {
        domainName: name,
        profile: {
          '@type': 'Person',
          '@context': 'http://schema.org'
        },
        verifications: [],
        registered: true
      }
    }
  })

  return updatedLocalIdentities
}

function refreshIdentities(addresses, addressLookupUrl, localIdentities, lastNameLookup) {
  return dispatch => {
    if (addresses.length === 0) {
      let namesOwned = []
      let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)
      if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
        // pass
      } else {
        dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
      }
    } else {

      let count =  addresses.length
      let namesOwned = []

      addresses.forEach((address) => {
        const url = addressLookupUrl.replace('{address}', address)
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => JSON.parse(responseText))
          .then((responseJson) => {
            count++
            namesOwned = namesOwned.concat(responseJson['names'])

            if(count >= addresses.length) {
              let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)

              if (JSON.stringify(lastNameLookup) === JSON.stringify(namesOwned)) {
                // pass
              } else {
                dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
              }
            }
          }).catch((error) => {
            console.warn(error)
          })

      })
    }
  }
}

function registerName(domainName, recipientAddress, tokenFileUrl, registerUrl,
                      blockstackApiAppId, blockstackApiAppSecret) {
  return dispatch => {
    const zoneFile = makeZoneFileForHostedProfile(domainName, tokenFileUrl),
      authHeader = 'Basic ' + btoa(blockstackApiAppId + ':' + blockstackApiAppSecret)
    const requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authHeader
    }
    const requestBody = JSON.stringify({
      username: domainName.split('.')[0],
      recipient_address: recipientAddress,
      profile: zoneFile
    })

    fetch(registerUrl, {
      method: 'POST',
      headers: requestHeaders,
      mode: 'cors',
      cache: 'default',
      body: requestBody
    })
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        dispatch(createNewIdentity(domainName))
      })
      .catch((error) => {
        console.warn(error)
      })
  }
}

function fetchCurrentIdentity(domainName, lookupUrl) {
  return dispatch => {
    let username
    if (lookupUrl.search('localhost') >= 0) {
      username = domainName
    } else if (lookupUrl.search('api.blockstack.com') >= 0) {
      username = domainName.split('.')[0]
    } else {
      throw "Invalid lookup URL"
    }
    const url = lookupUrl.replace('{name}', username)
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        let zoneFile
        let ownerAddress

        if (lookupUrl.search('localhost') >= 0) {
          zoneFile = responseJson['zonefile']
          ownerAddress = responseJson['address']
        } else if (lookupUrl.search('api.blockstack.com') >= 0) {
          const userData = responseJson[username]
          zoneFile = userData['zone_file']
          ownerAddress = userData['owner_address']
        } else {
          throw "Invalid lookup URL"
        }

        resolveZoneFileToProfile(zoneFile, ownerAddress, (profile) => {
          let verifications = []
          dispatch(updateCurrentIdentity(domainName, profile, verifications))
          if (profile) {
            validateProofs(profile, domainName).then((proofs) => {
              verifications = proofs
              dispatch(updateCurrentIdentity(domainName, profile, verifications))
            })
          }
        })
      })
      .catch((error) => {
        dispatch(updateCurrentIdentity(domainName, null, []))
        console.warn(error)
      })
  }
}

export const IdentityActions = {
  updateCurrentIdentity: updateCurrentIdentity,
  createNewIdentity: createNewIdentity,
  updateProfile: updateProfile,
  fetchCurrentIdentity: fetchCurrentIdentity,
  refreshIdentities: refreshIdentities,
  updateOwnedIdentities: updateOwnedIdentities,
  registerName: registerName
}

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  lastNameLookup: []
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
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: {
            domainName: action.domainName,
            profile: {
              '@type': 'Person',
              '@context': 'http://schema.org'
            },
            verifications: [],
            registered: false
          }
        })
      })
    case UPDATE_IDENTITIES:
      return Object.assign({}, state, {
        localIdentities: action.localIdentities,
        lastNameLookup: action.namesOwned
      })
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: Object.assign({}, state.localIdentities[action.domainName], {
            profile: action.profile
          })
        })
      })
    default:
      return state
  }
}

/*{
  domainName: 'ryan.id',
  profile: {},
  verifications: [],
  registered: false,
  blockNumber: null,
  transactionNumber: null
}*/
