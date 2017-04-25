import * as types from './types'
import { validateProofs } from 'blockstack'

import {
  resolveZoneFileToProfile
} from '../../../utils/index'

import log4js from 'log4js'


const logger = log4js.getLogger('profiles/store/identity/actions.js')




function updateCurrentIdentity(domainName, profile, verifications) {
  return {
    type: types.UPDATE_CURRENT,
    domainName,
    profile,
    verifications
  }
}

function createNewIdentity(domainName) {
  return {
    type: types.CREATE_NEW,
    domainName
  }
}

function updateOwnedIdentities(localIdentities, namesOwned) {
  return {
    type: types.UPDATE_IDENTITIES,
    localIdentities,
    namesOwned
  }
}

function updateProfile(domainName, profile) {
  return {
    type: types.UPDATE_PROFILE,
    domainName,
    profile
  }
}

function createNewIdentityFromDomain(domainName) {
  return dispatch => {
    dispatch(createNewIdentity(domainName))
  }
}

function calculateLocalIdentities(localIdentities, namesOwned) {
  const remoteNamesDict = {}
  const localNamesDict = {}
  const updatedLocalIdentities = localIdentities

  namesOwned.map((name) => {
    remoteNamesDict[name] = true
  })

  Object.keys(updatedLocalIdentities).forEach((name) => {
    const identity = updatedLocalIdentities[name]
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.map((name) => {
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

function refreshIdentities(api, addresses, localIdentities, namesOwned) {
  logger.trace('refreshIdentities')
  return dispatch => {
    if (addresses.length === 0) {
      const namesOwned = []
      const updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)
      if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
        // pass
      } else {
        dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
      }
    } else {
      let count =  addresses.length
      let newNamesOwned = []

      addresses.forEach((address) => {
        const url = api.addressLookupUrl.replace('{address}', address)
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => JSON.parse(responseText))
          .then((responseJson) => {
            count++
            newNamesOwned = newNamesOwned.concat(responseJson.names)

            if (count >= addresses.length) {
              const updatedLocalIdentities = calculateLocalIdentities(localIdentities,
                newNamesOwned)

              if (JSON.stringify(newNamesOwned) === JSON.stringify(namesOwned)) {
                // pass
              } else {
                dispatch(updateOwnedIdentities(updatedLocalIdentities, newNamesOwned))
                namesOwned.forEach((domainName) => {
                  const identity = updatedLocalIdentities[domainName]
                  const lookupUrl = api.nameLookupUrl.replace('{name}', identity.domainName)
                  fetch(lookupUrl).then((response) => response.text())
                  .then((responseText) => JSON.parse(responseText))
                  .then((lookupResponseJson) => {
                    const zoneFile = lookupResponseJson.zonefile
                    const ownerAddress = lookupResponseJson.address

                    resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                      if (profile) {
                        dispatch(updateProfile(domainName, profile))
                      }
                    })
                    .catch((error) => {
                      logger.error('refreshIdentities: resolveZoneFileToProfile: error', error)
                    })
                  })
                  .catch((error) => {
                    logger.error('refreshIdentities: lookupUrl: error', error)
                  })
                })
              }
            }
          })
          .catch((error) => {
            logger.error('refreshIdentities: addressLookup: error', error)
          })
      })
    }
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
          zoneFile = responseJson.zonefile
          ownerAddress = responseJson.address
        } else if (lookupUrl.search('api.blockstack.com') >= 0) {
          const userData = responseJson[username]
          zoneFile = userData.zone_file
          ownerAddress = userData.owner_address
        } else {
          throw 'Invalid lookup URL'
        }

        resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
          let verifications = []
          dispatch(updateCurrentIdentity(domainName, profile, verifications))
          if (profile) {
            validateProofs(profile, domainName).then((proofs) => {
              verifications = proofs
              dispatch(updateCurrentIdentity(domainName, profile, verifications))
            }).catch((error) => {
              logger.error(`fetchCurrentIdentity: ${domainName} validateProofs: error`, error)
            })
          }
        })
        .catch((error) => {
          logger.error(`fetchCurrentIdentity: ${domainName} resolveZoneFileToProfile: error`, error)
        })
      })
      .catch((error) => {
        dispatch(updateCurrentIdentity(domainName, null, []))
        logger.error(`fetchCurrentIdentity: ${domainName} lookup error`, error)
      })
  }
}

const IdentityActions = {
  updateCurrentIdentity,
  createNewIdentity,
  updateProfile,
  fetchCurrentIdentity,
  refreshIdentities,
  updateOwnedIdentities,
  createNewIdentityFromDomain
}


export default IdentityActions
