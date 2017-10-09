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

import type { Dispatch } from 'redux'

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

function updateSocialProofVerifications(index: number, verifications: Array<any>) {
  return {
    type: types.UPDATE_SOCIAL_PROOF_VERIFICATIONS,
    index,
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

function createNewIdentityWithOwnerAddress(index: number, ownerAddress: string) {
  logger.debug(`createNewIdentityWithOwnerAddress: index: ${index} address: ${ownerAddress}`)
  return (dispatch: Dispatch<*>) => {
    dispatch(createNewIdentity(index, ownerAddress))
    dispatch(AccountActions.usedIdentityAddress())
  }
}

function createNewProfile(encryptedBackupPhrase: string,
  password: string, nextUnusedAddressIndex: number) {
  return (dispatch: Dispatch<*>): void => {
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

/**
 * Checks each owner address to see if it owns a name, if it owns a name,
 * it resolves the profile and updates the state with the owner address's
 * current name.
 */
function refreshIdentities(api: {bitcoinAddressLookupUrl: string,
  nameLookupUrl: string}, ownerAddresses: Array<string>) {
  return (dispatch: Dispatch<*>): Promise<*> => {
    logger.trace('refreshIdentities')
    const promises: Array<Promise<*>> = []
    ownerAddresses.forEach((address, index) => {
      const promise: Promise<*> = new Promise((resolve) => {
        const url = api.bitcoinAddressLookupUrl.replace('{address}', address)
        logger.debug(`refreshIdentities: fetching ${url}`)
        fetch(url)
        .then((response) => response.text())
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.names.length === 0) {
            logger.debug(`refreshIdentities: ${address} owns no names`)
            resolve()
            return
          } else {
            if (responseJson.names.length === 1) {
              logger.debug(`refreshIdentities: ${address} has 1 name}`)
            } else {
              logger.debug(`refreshIdentities: ${address} has multiple names. Only using 0th.`)
            }
            const nameOwned = responseJson.names[0]
            dispatch(usernameOwned(index, nameOwned))
            logger.debug(`refreshIdentities: Preparing to resolve profile for ${nameOwned}`)
            const lookupUrl = api.nameLookupUrl.replace('{name}', nameOwned)
            logger.debug(`refreshIdentities: fetching: ${lookupUrl}`)
            fetch(lookupUrl).then((response) => response.text())
            .then((responseText) => JSON.parse(responseText))
            .then((lookupResponseJson) => {
              const zoneFile = lookupResponseJson.zonefile
              const ownerAddress = lookupResponseJson.address
              logger.debug(`refreshIdentities: resolving zonefile of ${nameOwned} to profile`)
              resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                if (profile) {
                  dispatch(updateProfile(index, profile, [], zoneFile))
                  let verifications = []
                  validateProofs(profile, ownerAddress, nameOwned).then((proofs) => {
                    verifications = proofs
                    dispatch(updateProfile(index, profile, verifications, zoneFile))
                  }).catch((error) => {
                    logger.error(`fetchCurrentIdentity: ${nameOwned} validateProofs: error`, error)
                  })
                }
                resolve()
              })
              .catch((error) => {
                logger.error(`refreshIdentities: resolveZoneFileToProfile for ${nameOwned} error`,
                  error)
                resolve()
              })
            })
            .catch((error) => {
              logger.error('refreshIdentities: name lookup: error', error)
              resolve()
            })
          }
        })
        .catch((error) => {
          logger.error('refreshIdentities: addressLookup: error', error)
          resolve()
        })
        promises.push(promise)
      })
    })
    return Promise.all(promises)
  }
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

function fetchCurrentIdentity(lookupUrl: string, domainName: string) {
  return (dispatch: Dispatch<*>): Promise<*> => {
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
