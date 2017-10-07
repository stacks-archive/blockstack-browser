// @flow
import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import * as types from './types'
import { validateProofs } from 'blockstack'
import {
  decrypt,
  deriveIdentityKeyPair,
  resolveZoneFileToProfile,
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode,
  authorizationHeaderValue
} from '../../../utils/index'

import { DEFAULT_PROFILE } from '../../../utils/profile-utils'
import { AccountActions } from '../../../account/store/account'

import log4js from 'log4js'


const logger = log4js.getLogger('profiles/store/identity/actions.js')

function updateCurrentIdentity(index: number) {
  return {
    type: types.UPDATE_CURRENT,
    index
  }
}

function setDefaultIdentity(index: number) {
  return {
    type: types.SET_DEFAULT,
    index
  }
}

function createNewIdentity(index: number, ownerAddress: string) {
  return {
    type: types.CREATE_NEW,
    index,
    ownerAddress
  }
}

function createNewProfileError(error: any) {
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

function usernameOwned(index: number, username: string) {
  return {
    type: types.USERNAME_OWNED,
    index,
    username
  }
}

function noUsernameOwned(index: number) {
  return {
    type: types.NO_USERNAME_OWNED,
    index
  }
}

function updateProfile(index: number, profile: any, verifications: Array<any>, zoneFile: string) {
  return {
    type: types.UPDATE_PROFILE,
    index,
    profile,
    zoneFile,
    verifications
  }
}

function updateSocialProofVerifications(domainName, verifications) {
  return {
    type: types.UPDATE_SOCIAL_PROOF_VERIFICATIONS,
    domainName,
    verifications,
  }
}

function addUsername(index: number, username: string) {
  return {
    type: types.ADD_USERNAME,
    index,
    username
  }
}

function broadcastingZoneFileUpdate(domainName: string) {
  return {
    type: types.BROADCASTING_ZONE_FILE_UPDATE,
    domainName
  }
}

function broadcastedZoneFileUpdate(domainName: string) {
  return {
    type: types.BROADCASTED_ZONE_FILE_UPDATE,
    domainName
  }
}

function broadcastingZoneFileUpdateError(domainName: string, error: any) {
  return {
    type: types.BROADCASTING_ZONE_FILE_UPDATE_ERROR,
    domainName,
    error
  }
}

function broadcastingNameTransfer(domainName: string) {
  return {
    type: types.BROADCASTING_NAME_TRANSFER,
    domainName
  }
}

function broadcastedNameTransfer(domainName: string) {
  return {
    type: types.BROADCASTED_NAME_TRANSFER,
    domainName
  }
}

function broadcastingNameTransferError(domainName: string, error: any) {
  return {
    type: types.BROADCASTING_NAME_TRANSFER_ERROR,
    domainName,
    error
  }
}

function createNewIdentityWithOwnerAddress(domainName, ownerAddress, addingUsername = false, zoneFile) {
  logger.debug(`createNewIdentityFromDomain: name: ${domainName} address: ${ownerAddress}`)
  return (dispatch, getState) => {
    if (!addingUsername) {
      logger.trace('createNewIdentityFromDomain: Not adding a username')
      dispatch(createNewIdentity(domainName, ownerAddress))
      dispatch(AccountActions.usedIdentityAddress())
    } else {
      logger.trace('createNewIdentityFromDomain: adding username to existing profile')
      dispatch(addUsername(domainName, ownerAddress, zoneFile))
      const state = getState()
      if (!state.profiles) {
        return
      }
      // If we are adding a domainName to the default identity, then
      // we need to update our default field to the new domainName
      if (state.profiles.identity.default === ownerAddress) {
        dispatch(setDefaultIdentity(domainName))
      }
    }
  }
}

function createNewProfile(encryptedBackupPhrase: string,
  password: string, nextUnusedAddressIndex: number) {
  return (dispatch: () => mixed): void => {
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
      const index = nextUnusedAddressIndex
      const identityOwnerAddressNode =
      getIdentityOwnerAddressNode(identityPrivateKeychainNode, index)
      const newIdentityKeypair = deriveIdentityKeyPair(identityOwnerAddressNode)
      logger.debug(`createNewProfile: new identity: ${newIdentityKeypair.address}`)
      dispatch(AccountActions.newIdentityAddress(newIdentityKeypair))
      dispatch(AccountActions.usedIdentityAddress())
      const ownerAddress = newIdentityKeypair.address
      dispatch(createNewIdentityWithOwnerAddress(index, ownerAddress))
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

  namesOwned.forEach((name) => {
    remoteNamesDict[name] = true
  })

  Object.keys(updatedLocalIdentities).forEach((name) => {
    const identity = updatedLocalIdentities[name]
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.forEach((name) => {
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
  return dispatch => new Promise((resolve) => {
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
      let i = 0
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

                  if (updatedLocalIdentities[ownerAddress]) {
                    logger.debug(`j: ${j} attempting to add username to ${ownerAddress}`)
                    dispatch(addUsername(domainName, ownerAddress, zoneFile))
                  }

                  logger.debug(`j: ${j} resolving zonefile to profile`)
                  resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                    j++
                    if (profile) {
                       dispatch(updateProfile(domainName, profile, [], zoneFile))
                       let verifications = []
                       validateProofs(profile, ownerAddress, domainName).then((proofs) => {
                         verifications = proofs
                         dispatch(updateProfile(domainName, profile, verifications, zoneFile))
                       }).catch((error) => {
                         logger.error(`fetchCurrentIdentity: ${domainName} validateProofs: error`, error)
                       })
                    logger.debug(`j: ${j} namesOwned.length: ${namesOwned.length}`)
                    if (j >= namesOwned.length) {
                      resolve()
                    }
                  }
                  })
                  .catch((error) => {
                    j++
                    logger.error(`j: ${j} refreshIdentities: resolveZoneFileToProfile: error`,
                      error)
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

function refreshSocialProofVerifications(profile, ownerAddress, domainName) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let verifications = []
      validateProofs(profile, ownerAddress, domainName).then((proofs) => {
        verifications = proofs
        dispatch(updateSocialProofVerifications(domainName, verifications))
        resolve()
      }).catch((error) => {
        logger.error(`fetchCurrentIdentity: ${domainName} validateProofs: error`, error)
        dispatch(updateSocialProofVerifications(domainName, []))
        resolve()
      })
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
      throw new Error('Invalid lookup URL')
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
          throw new Error('Invalid lookup URL')
        }

        return resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
          let verifications = []
          dispatch(updateCurrentIdentity(domainName, profile, verifications, zoneFile))
          if (profile) {
            return validateProofs(profile, ownerAddress, domainName).then((proofs) => {
              verifications = proofs
              dispatch(updateCurrentIdentity(domainName, profile, verifications, zoneFile))
            }).catch((error) => {
              logger.error(`fetchCurrentIdentity: ${domainName} validateProofs: error`, error)
            })
          } else {
            logger.debug('fetchCurrentIdentity: no profile: not updating identity')
            return Promise.reject()
          }
        })
        .catch((error) => {
          logger.error(`fetchCurrentIdentity: ${domainName} resolveZoneFileToProfile: error`, error)
          dispatch(updateCurrentIdentity(domainName, DEFAULT_PROFILE, [], zoneFile))
        })
      })
      .catch((error) => {
        dispatch(updateCurrentIdentity(domainName, null, [], null))
        logger.error(`fetchCurrentIdentity: ${domainName} lookup error`, error)
      })
  }
}

function broadcastZoneFileUpdate(zoneFileUrl, coreAPIPassword, name, keypair, zoneFile) {
  logger.trace('broadcastZoneFileUpdate: entering')
  return dispatch => {
    dispatch(broadcastingZoneFileUpdate(name))
    // Core registers with an uncompressed address,
    // browser expects compressed addresses,
    // we need to add a suffix to indicate to core
    // that it should use a compressed addresses
    // see https://en.bitcoin.it/wiki/Wallet_import_format
    // and https://github.com/blockstack/blockstack-browser/issues/607
    const compressedPublicKeySuffix = '01'
    const coreFormatOwnerKey = `${keypair.key}${compressedPublicKeySuffix}`
    const url = zoneFileUrl.replace('{name}', name)
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorizationHeaderValue(coreAPIPassword)
    }
    const ownerKey = coreFormatOwnerKey
    const requestBody = JSON.stringify({
      owner_key: ownerKey,
      zonefile: zoneFile
    })
    logger.debug(`broadcastZoneFileUpdate: PUT to ${url}`)
    return fetch(url,
      {
        method: 'PUT',
        headers: requestHeaders,
        body: requestBody
      })
      .then((response) => {
        if (response.ok) {
          dispatch(broadcastedZoneFileUpdate(name))
        } else {
          response.text()
          .then((responseText) => JSON.parse(responseText))
          .then((responseJson) => {
            const error = responseJson.error
            logger.error('broadcastZoneFileUpdate: error', error)
            dispatch(broadcastingZoneFileUpdateError(name, error))
          })
        }
      })
      .catch((error) => {
        logger.error('broadcastZoneFileUpdate: error', error)
        dispatch(broadcastingZoneFileUpdateError(name, error))
      })
  }
}

function broadcastNameTransfer(nameTransferUrl, coreAPIPassword, name, keypair, newOwnerAddress) {
  logger.trace('broadcastNameTransfer: entering')
  return dispatch => {
    dispatch(broadcastingNameTransfer(name))
    // Core registers with an uncompressed address,
    // browser expects compressed addresses,
    // we need to add a suffix to indicate to core
    // that it should use a compressed addresses
    // see https://en.bitcoin.it/wiki/Wallet_import_format
    // and https://github.com/blockstack/blockstack-browser/issues/607
    const compressedPublicKeySuffix = '01'
    const coreFormatOwnerKey = `${keypair.key}${compressedPublicKeySuffix}`
    const url = nameTransferUrl.replace('{name}', name)
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorizationHeaderValue(coreAPIPassword)
    }
    const ownerKey = coreFormatOwnerKey
    const requestBody = JSON.stringify({
      owner_key: ownerKey,
      owner: newOwnerAddress
    })
    logger.debug(`broadcastNameTransfer: PUT to ${url}`)
    return fetch(url,
      {
        method: 'PUT',
        headers: requestHeaders,
        body: requestBody
      })
      .then((response) => {
        if (response.ok) {
          dispatch(broadcastedNameTransfer(name))
        } else {
          response.text()
          .then((responseText) => JSON.parse(responseText))
          .then((responseJson) => {
            const error = responseJson.error
            logger.error('broadcastNameTransfer: error', error)
            dispatch(broadcastingNameTransferError(name, error))
          })
        }
      })
      .catch((error) => {
        logger.error('broadcastZoneFileUpdate: error', error)
        dispatch(broadcastingNameTransferError(name, error))
      })
  }
}

const IdentityActions = {
  calculateLocalIdentities,
  updateCurrentIdentity,
  setDefaultIdentity,
  createNewIdentity,
  createNewIdentityWithOwnerAddress,
  createNewProfile,
  updateProfile,
  fetchCurrentIdentity,
  refreshIdentities,
  refreshSocialProofVerifications,
  addUsername,
  usernameOwned,
  noUsernameOwned,
  createNewProfileError,
  resetCreateNewProfileError,
  broadcastingZoneFileUpdate,
  broadcastedZoneFileUpdate,
  broadcastingZoneFileUpdateError,
  broadcastZoneFileUpdate,
  broadcastingNameTransfer,
  broadcastedNameTransfer,
  broadcastingNameTransferError,
  broadcastNameTransfer
}


export default IdentityActions
