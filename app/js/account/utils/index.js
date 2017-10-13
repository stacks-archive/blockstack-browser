// @flow
import { uploadPhotoToDropbox, uploadProfileToDropbox } from './dropbox'
import { uploadPhotoToGaiaHub, uploadProfileToGaiaHub } from './blockstack-inc'
import type { GaiaHubConfig } from './blockstack-inc'
import log4js from 'log4js'

const logger = log4js.getLogger('account/utils/index.js')

export const BLOCKSTACK_INC = 'gaia-hub'
export const DROPBOX = 'dropbox'

function getStorageMethod(api: {dropboxAccessToken: string}) {
  if (api.hostedDataLocation === DROPBOX &&
    api.dropboxAccessToken.length > 0) {
    return DROPBOX
  }
  return BLOCKSTACK_INC
}

function checkIdentityInputs(identityIndex: number, identityAddress: string) {
  if (!identityIndex && identityIndex !== 0) {
    const message = 'checkIdentityInputs: No identity index provided'
    logger.error(message)
    throw new Error(message)
  }

  if (!identityAddress) {
    const message = 'checkIdentityInputs: No identity address provided'
    logger.error(message)
    throw new Error(message)
  }
}

export function uploadPhoto(api: {dropboxAccessToken: string, gaiaHubConfig: GaiaHubConfig},
  identityIndex: number, identityAddress: string, photoFile: string, photoIndex: number) {
  const storageMethod = getStorageMethod(api)
  logger.debug(`uploadPhoto: id index: ${identityIndex} id address ${identityAddress}`)
  switch (storageMethod) {
    case DROPBOX:
      return uploadPhotoToDropbox(api, identityIndex, identityAddress, photoFile, photoIndex)
    default:
      return uploadPhotoToGaiaHub(api, identityIndex, identityAddress, photoFile, photoIndex)
  }
}

export function uploadProfile(api: {dropboxAccessToken: string, gaiaHubConfig: GaiaHubConfig },
  identityIndex: number, identityAddress: string, signedProfileTokenData: string,
  firstUpload: boolean = false) {
  checkIdentityInputs(identityIndex, identityAddress)

  const storageMethod = getStorageMethod(api)

  switch (storageMethod) {
    case DROPBOX:
      return uploadProfileToDropbox(api, identityIndex, identityAddress,
        signedProfileTokenData, firstUpload)

    default:
      return uploadProfileToGaiaHub(api, identityIndex, identityAddress,
        signedProfileTokenData)
  }
}
