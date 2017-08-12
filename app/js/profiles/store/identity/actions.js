import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import * as types from './types'
import { validateProofs } from 'blockstack'
import {
  decrypt,
  deriveIdentityKeyPair,
  resolveZoneFileToProfile,
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode
} from '../../../utils/index'

import { AccountActions } from '../../../account/store/account'

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

function setDefaultIdentity(domainName) {
  return {
    type: types.SET_DEFAULT,
    domainName
  }
}

function createNewIdentity(domainName, ownerAddress) {
  return {
    type: types.CREATE_NEW,
    domainName,
    ownerAddress
  }
}

function createNewProfileError(error) {
  return {
    type: types.CREATE_PROFILE_ERROR,
    error
  }
}

function resetCreateNewProfileError() {
  return {
    type: types.RESET_CREATE_PROFILE_ERROR
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

function addUsername(domainName, ownerAddress) {
  return {
    type: types.ADD_USERNAME,
    domainName,
    ownerAddress
  }
}

function createNewIdentityFromDomain(domainName, ownerAddress, addingUsername = false) {
  logger.debug(`createNewIdentityFromDomain: domainName: ${domainName} ownerAddress: ${ownerAddress}`)
  return dispatch => {
    if (!addingUsername) {
      logger.trace('createNewIdentityFromDomain: Not adding a username')
      dispatch(createNewIdentity(domainName, ownerAddress))
      dispatch(AccountActions.usedIdentityAddress())
    } else {
      logger.trace('createNewIdentityFromDomain: adding username to existing profile')
      dispatch(addUsername(domainName, ownerAddress))
    }
  }
}

function createNewProfile(encryptedBackupPhrase, password, nextUnusedAddressIndex) {
  return dispatch => {
    logger.trace('createNewProfile')
    // Decrypt master keychain
    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    logger.debug('createNewProfile: Trying to decrypt backup phrase...')
    return decrypt(dataBuffer, password)
    .then((plaintextBuffer) => {
      logger.debug('createNewProfile: Backup phrase successfully decrypted')
      const backupPhrase = plaintextBuffer.toString()
      const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
      const masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
      const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
      const identityOwnerAddressNode =
      getIdentityOwnerAddressNode(identityPrivateKeychainNode, nextUnusedAddressIndex)
      const newIdentityKeypair = deriveIdentityKeyPair(identityOwnerAddressNode)
      logger.debug(`createNewProfile: new identity: ${newIdentityKeypair.address}`)
      dispatch(AccountActions.newIdentityAddress(newIdentityKeypair))
      dispatch(AccountActions.usedIdentityAddress())
      const ownerAddress = newIdentityKeypair.address
      dispatch(createNewIdentityFromDomain(ownerAddress, ownerAddress))
    }, () => {
      logger.error('createNewProfile: Invalid password')
      dispatch(createNewProfileError('Your password is incorrect.'))
    })
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
    return new Promise((resolve, reject) => {
      if (addresses.length === 0) {
        const newNamesOwned = []
        const updatedLocalIdentities = calculateLocalIdentities(localIdentities, newNamesOwned)
        if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
          // pass
          resolve()
        } else {
          dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
          resolve()
        }
      } else {
        let i =  0
        let newNamesOwned = []

        addresses.forEach((address) => {
          const url = api.bitcoinAddressLookupUrl.replace('{address}', address)
          fetch(url)
            .then((response) => response.text())
            .then((responseText) => JSON.parse(responseText))
            .then((responseJson) => {
              i++
              newNamesOwned = newNamesOwned.concat(responseJson.names)

              logger.debug(`i: ${i} addresses.length: ${addresses.length}`)
              if (i >= addresses.length) {
                const updatedLocalIdentities = calculateLocalIdentities(localIdentities,
                  newNamesOwned)

                if (JSON.stringify(newNamesOwned) === JSON.stringify(namesOwned)) {
                  // pass
                  logger.trace('Names owned have not changed')
                  resolve()
                } else {
                  logger.trace('Names owned changed. Dispatching updateOwnedIdentities')
                  dispatch(updateOwnedIdentities(updatedLocalIdentities, newNamesOwned))
                  logger.debug(`Preparing to resolve profiles for ${namesOwned.length} names`)
                  let j = 0
                  newNamesOwned.forEach((domainName) => {
                    const identity = updatedLocalIdentities[domainName]
                    const lookupUrl = api.nameLookupUrl.replace('{name}', identity.domainName)
                    logger.debug(`j: ${j} fetching: ${lookupUrl}`)
                    fetch(lookupUrl).then((response) => response.text())
                    .then((responseText) => JSON.parse(responseText))
                    .then((lookupResponseJson) => {
                      const zoneFile = lookupResponseJson.zonefile
                      const ownerAddress = lookupResponseJson.address

                      logger.debug(`j: ${j} resolving zonefile to profile`)
                      resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                        j++
                        if (profile) {
                          dispatch(updateProfile(domainName, profile))
                        }
                        logger.debug(`j: ${j} namesOwned.length: ${namesOwned.length}`)
                        if (j >= namesOwned.length) {
                          resolve()
                        }
                      })
                      .catch((error) => {
                        j++
                        logger.error(`j: ${j} refreshIdentities: resolveZoneFileToProfile: error`, error)
                        if (j >= namesOwned.length) {
                          resolve()
                        }
                      })
                    })
                    .catch((error) => {
                      j++
                      logger.error(`j: ${j} refreshIdentities: lookupUrl: error`, error)
                      if (j >= namesOwned.length) {
                        resolve()
                      }
                    })
                  })
                }
              }
            })
            .catch((error) => {
              i++
              logger.error(`i: ${i} refreshIdentities: addressLookup: error`, error)
              if (i >= addresses.length)  {
                resolve()
              }
            })
        })
      }
    })
  }
}

function fetchCurrentIdentity(lookupUrl, domainName) {
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
    return fetch(url)
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

        return resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
          let verifications = []
          dispatch(updateCurrentIdentity(domainName, profile, verifications))
          if (profile) {
            return validateProofs(profile, domainName).then((proofs) => {
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
  calculateLocalIdentities,
  updateCurrentIdentity,
  setDefaultIdentity,
  createNewIdentity,
  createNewProfile,
  updateProfile,
  fetchCurrentIdentity,
  refreshIdentities,
  updateOwnedIdentities,
  createNewIdentityFromDomain,
  addUsername,
  createNewProfileError,
  resetCreateNewProfileError
}


export default IdentityActions
