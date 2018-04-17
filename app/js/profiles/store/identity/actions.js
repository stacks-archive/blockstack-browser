// @flow
import bip39 from 'bip39'
import * as types from './types'
import { validateProofs, BlockstackWallet } from 'blockstack'
import {
  decrypt,
  resolveZoneFileToProfile,
  authorizationHeaderValue
} from '../../../utils/index'
import { DEFAULT_PROFILE,
  fetchProfileLocations } from '../../../utils/profile-utils'
import { calculateTrustLevel } from '../../../utils/account-utils'
import { AccountActions } from '../../../account/store/account'
import { isWebAppBuild } from '../../../utils/window-utils'


import type { Dispatch } from 'redux'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/store/identity/actions.js')


function validateProofsService(profile: Object, address: string, username : ?string = null) {
  if (!isWebAppBuild()) {
    return validateProofs(profile, address, username)
  }

  const args: {profile : Object, address: string, username?: string } = { profile, address }
  if (username !== null && username !== undefined) {
    args.username = username
  }
  return fetch('https://proofs.blockstack.org/validate/',
               { method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(args) })
    .then(resp => resp.json())
}

function updatePublicIdentity(username: string, ownerAddress: ?string = null,
  zoneFile: ?string = null, profile: ?{} = Object.assign({}, DEFAULT_PROFILE),
  verifications: Array<*> = [], trustLevel: ?number = 0) {
  return {
    type: types.UPDATE_PUBLIC_IDENTITY,
    username,
    ownerAddress,
    zoneFile,
    profile,
    verifications,
    trustLevel
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

function updateProfile(index: number, profile: any, zoneFile: string) {
  return {
    type: types.UPDATE_PROFILE,
    index,
    profile,
    zoneFile
  }
}

function updateSocialProofVerifications(index: number, verifications: Array<any>,
  trustLevel: number) {
  return {
    type: types.UPDATE_SOCIAL_PROOF_VERIFICATIONS,
    index,
    verifications,
    trustLevel
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
  return (dispatch: Dispatch<*>): void => {
    dispatch(createNewIdentity(index, ownerAddress))
    dispatch(AccountActions.usedIdentityAddress())
  }
}

function createNewProfile(encryptedBackupPhrase: string,
  password: string, nextUnusedAddressIndex: number) {
  return (dispatch: Dispatch<*>): Promise<*> => {
    logger.trace('createNewProfile')
    // Decrypt master keychain
    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    logger.debug('createNewProfile: Trying to decrypt backup phrase...')
    return decrypt(dataBuffer, password)
    .then((plaintextBuffer) => {
      logger.debug('createNewProfile: Backup phrase successfully decrypted')
      const backupPhrase = plaintextBuffer.toString()
      const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
      const wallet = new BlockstackWallet(seedBuffer)
      const index = nextUnusedAddressIndex
      const newIdentityKeypair = wallet.getIdentityKeyPair(index, true)
      logger.debug(`createNewProfile: new identity: ${newIdentityKeypair.address}`)
      dispatch(AccountActions.newIdentityAddress(newIdentityKeypair))
      const ownerAddress = newIdentityKeypair.address
      // $FlowFixMe
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
 *
 * If it doesn't have a name, check default gaia storage for a profile
 *
 */
function refreshIdentities(api: {bitcoinAddressLookupUrl: string,
  nameLookupUrl: string}, ownerAddresses: Array<string>) {
  return (dispatch: Dispatch<*>): Promise<*> => {
    logger.trace('refreshIdentities')

    const promises: Array<Promise<*>> = ownerAddresses.map((address, index) => {
      const promise: Promise<*> = new Promise((resolve) => {
        const url = api.bitcoinAddressLookupUrl.replace('{address}', address)
        logger.debug(`refreshIdentities: fetching ${url}`)
        return fetch(url)
        .then((response) => response.text())
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          if (responseJson.names.length === 0) {
            logger.debug(`refreshIdentities: ${address} owns no names, checking default locations.`)
            const gaiaBucketAddress = ownerAddresses[0]
            return fetchProfileLocations('https://gaia.blockstack.org/hub',
                                         address, gaiaBucketAddress, index)
              .then(returnObject => {
                if (returnObject && returnObject.profile) {
                  const profile = returnObject.profile
                  const zoneFile = ''
                  dispatch(updateProfile(index, profile, zoneFile))
                  let verifications = []
                  let trustLevel = 0
                  logger.debug(`refreshIdentities: validating address proofs for ${address}`)
                  return validateProofsService(profile, address)
                    .then((proofs) => {
                      verifications = proofs
                      trustLevel = calculateTrustLevel(verifications)
                      dispatch(updateSocialProofVerifications(index, verifications, trustLevel))
                      resolve()
                    })
                    .catch((error) => {
                      logger.error(`refreshIdentities: ${address} validateProofs: error`, error)
                      resolve()
                    })
                } else {
                  resolve()
                  return Promise.resolve()
                }
              })
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
            return fetch(lookupUrl).then((response) => response.text())
            .then((responseText) => JSON.parse(responseText))
            .then((lookupResponseJson) => {
              const zoneFile = lookupResponseJson.zonefile
              const ownerAddress = lookupResponseJson.address
              logger.debug(`refreshIdentities: resolving zonefile of ${nameOwned} to profile`)
              return resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                if (profile) {
                  dispatch(updateProfile(index, profile, zoneFile))
                  let verifications = []
                  let trustLevel = 0
                  return validateProofsService(profile, ownerAddress, nameOwned).then((proofs) => {
                    verifications = proofs
                    trustLevel = calculateTrustLevel(verifications)
                    dispatch(updateSocialProofVerifications(index, verifications, trustLevel))
                  })
                  .catch((error) => {
                    logger.error(`refreshIdentities: ${nameOwned} validateProofs: error`, error)
                    return Promise.resolve()
                  })
                }
                resolve()
                return Promise.resolve()
              })
              .catch((error) => {
                logger.error(`refreshIdentities: resolveZoneFileToProfile for ${nameOwned} error`,
                  error)
                resolve()
                return Promise.resolve()
              })
            })
            .catch((error) => {
              logger.error('refreshIdentities: name lookup: error', error)
              resolve()
              return Promise.resolve()
            })
          }
        })
        .catch((error) => {
          logger.error('refreshIdentities: addressLookup: error', error)
          resolve()
          return Promise.resolve()
        })
      })
      return promise
    })
    return Promise.all(promises)
  }
}

function refreshSocialProofVerifications(identityIndex: number,
  ownerAddress: string, username: string, profile: {}) {
  return (dispatch: Dispatch<*>): Promise<*> => new Promise((resolve) => {
    let verifications = []
    let trustLevel = 0
    validateProofsService(profile, ownerAddress, username).then((proofs) => {
      verifications = proofs
      trustLevel = calculateTrustLevel(verifications)
      dispatch(updateSocialProofVerifications(identityIndex, verifications, trustLevel))
      resolve()
    }).catch((error) => {
      logger.error(`refreshSocialProofVerifications: index ${identityIndex} proofs error`, error)
      dispatch(updateSocialProofVerifications(identityIndex, [], trustLevel))
      resolve()
    })
  })
}

/**
 * Resolves a Blockstack ID username to zonefile, fetches the profile file,
 * validates proofs and then stores the results in the identity store in an
 * object under the key publicIdentities.
 *
 * @param  {String} lookupUrl name look up endpoint
 * @param  {String} username  the username of the Blockstack ID to fetch
 */
function fetchPublicIdentity(lookupUrl: string, username: string) {
  return (dispatch: Dispatch<*>): Promise<*> => {
    const url = lookupUrl.replace('{name}', username)
    return fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        const zoneFile = responseJson.zonefile
        const ownerAddress = responseJson.address

        return resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
          let verifications = []
          let trustLevel = 0
          dispatch(updatePublicIdentity(username, ownerAddress, zoneFile, profile,
            verifications, trustLevel))
          if (profile) {
            return validateProofsService(profile, ownerAddress, username).then((proofs) => {
              verifications = proofs
              trustLevel = calculateTrustLevel(verifications)
              dispatch(updatePublicIdentity(username, ownerAddress, zoneFile, profile,
                verifications, trustLevel))
            }).catch((error) => {
              logger.error(`fetchPublicIdentity: ${username} validateProofs: error`, error)
              return Promise.resolve()
            })
          } else {
            logger.debug('fetchPublicIdentity: no profile')
            dispatch(updatePublicIdentity(username, ownerAddress, zoneFile))
            return Promise.resolve()
          }
        })
        .catch((error) => {
          logger.error(`fetchPublicIdentity: ${username} resolveZoneFileToProfile: error`, error)
          dispatch(updatePublicIdentity(username, ownerAddress, zoneFile))
        })
      })
      .catch((error) => {
        dispatch(updatePublicIdentity(username))
        logger.error(`fetchCurrentIdentity: ${username} lookup error`, error)
      })
  }
}

function broadcastZoneFileUpdate(zoneFileUrl: string, coreAPIPassword: string,
  name: string, keypair: {key: string}, zoneFile: string) {
  logger.trace('broadcastZoneFileUpdate: entering')
  return (dispatch: Dispatch<*>): Promise<*> => {
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

function broadcastNameTransfer(nameTransferUrl: string, coreAPIPassword: string,
  name: string, keypair: {key: string}, newOwnerAddress: string) {
  logger.trace('broadcastNameTransfer: entering')
  return (dispatch: Dispatch<*>): Promise<*> =>  {
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
  updatePublicIdentity,
  setDefaultIdentity,
  createNewIdentity,
  createNewIdentityWithOwnerAddress,
  createNewProfile,
  updateProfile,
  fetchPublicIdentity,
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
