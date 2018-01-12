// @flow
import { parseZoneFile } from 'zone-file'

import type { GaiaHubConfig } from 'blockstack'
import { getFullReadUrl, connectToGaiaHub, uploadToGaiaHub } from 'blockstack'

import { getTokenFileUrlFromZoneFile } from '../../utils/zone-utils'

import log4js from 'log4js'

const logger = log4js.getLogger('account/utils/index.js')

export const BLOCKSTACK_INC = 'gaia-hub'
export const DROPBOX = 'dropbox'

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

function getProfileUploadLocation(identity: any, hubConfig: GaiaHubConfig) {
  if (identity.zoneFile) {
    const zoneFileJson = parseZoneFile(identity.zoneFile)
    return getTokenFileUrlFromZoneFile(zoneFileJson)
  } else {
    return getFullReadUrl('profile.json', hubConfig)
  }
}

// aaron: this should be moved into blockstack.js
function canWriteUrl(url: string,
                     hubConfig: GaiaHubConfig): ?string {
  const readPrefix = `${hubConfig.url_prefix}${hubConfig.address}/`
  if (url.startsWith(readPrefix)) {
    return url.substring(readPrefix.length)
  } else {
    return null
  }
}

function tryUpload(urlToWrite: string, data: string,
                   hubConfig: GaiaHubConfig, mimeType: ?string = undefined) {
  const filenameWrite = canWriteUrl(urlToWrite, hubConfig)
  if (filenameWrite === null) {
    return null
  }
  return uploadToGaiaHub(filenameWrite, data, hubConfig, mimeType)
}

export function uploadPhoto(
  api: {dropboxAccessToken: string, gaiaHubConfig: GaiaHubConfig},
  identity: any,
  identityIndex: number, identityAddress: string, photoFile: string, photoIndex: number) {
  checkIdentityInputs(identityIndex, identityAddress)

  return connectToGaiaHub('')
    .then((identityHubConfig) => {
      const globalHubConfig = api.gaiaHubConfig

      let uploadPrefix = getProfileUploadLocation(identity, identityHubConfig)
      if (uploadPrefix.endsWith('profile.json')) {
        uploadPrefix = uploadPrefix.substring(0, uploadPrefix.length - 'profile.json'.length)
      } else {
        throw new Error(`Cannot determine photo location based on profile location ${uploadPrefix}`)
      }
      const urlToWrite = `${uploadPrefix}/avatar-${photoIndex}`
      let uploadAttempt = tryUpload(urlToWrite, photoFile, identityHubConfig, undefined)
      if (uploadAttempt === null) {
        uploadAttempt = tryUpload(urlToWrite, photoFile, globalHubConfig, undefined)
      }

      // if still null, we don't know the write gaia-hub-config to write the file.
      if (uploadAttempt === null) {
        throw new Error(`Wanted to write to ${urlToWrite} but I don't know how.`)
      }

      return uploadAttempt
    })
}

export function uploadProfile(
  api: {dropboxAccessToken: string, gaiaHubConfig: GaiaHubConfig },
  identity: any,
  identityIndex: number, identityAddress: string, signedProfileTokenData: string) {
  checkIdentityInputs(identityIndex, identityAddress)

  return connectToGaiaHub('')
    .then((identityHubConfig) => {
      const globalHubConfig = api.gaiaHubConfig

      const urlToWrite = getProfileUploadLocation(identity, identityHubConfig)

      let uploadAttempt = tryUpload(urlToWrite, signedProfileTokenData,
                                    identityHubConfig, 'application/json')
      if (uploadAttempt === null) {
        uploadAttempt = tryUpload(urlToWrite, signedProfileTokenData,
                                  globalHubConfig, 'application/json')
      }

      // if still null, we don't know the write gaia-hub-config to write the file.
      if (uploadAttempt === null) {
        throw new Error(`Wanted to write to ${urlToWrite} but I don't know how.`)
      }

      return uploadAttempt
    })
}
