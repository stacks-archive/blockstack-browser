// @flow
import { parseZoneFile } from 'zone-file'

import type { GaiaHubConfig } from './blockstack-inc'
import { connectToGaiaHub, uploadToGaiaHub } from './blockstack-inc'

import { encryptContent, decryptContent } from 'blockstack'
import { getTokenFileUrlFromZoneFile } from '@utils/zone-utils'

import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

export const BLOCKSTACK_INC = 'gaia-hub'
const DEFAULT_PROFILE_FILE_NAME = 'profile.json'
const DEFAULT_IDENTITY_SETTINGS_FILE_NAME = 'settings.json'

function getProfileUploadLocation(identity: any, hubConfig: GaiaHubConfig) {
  if (identity.zoneFile) {
    const zoneFileJson = parseZoneFile(identity.zoneFile)
    return getTokenFileUrlFromZoneFile(zoneFileJson)
  } else {
    // aaron-debt: this should call a function in blockstack.js to get
    //   the read url
    return `${hubConfig.url_prefix}${hubConfig.address}/${DEFAULT_PROFILE_FILE_NAME}`
  }
}

function getSettingsUploadLocation(hubConfig: GaiaHubConfig) {
  return `${hubConfig.url_prefix}${hubConfig.address}/${DEFAULT_IDENTITY_SETTINGS_FILE_NAME}`
}

// aaron-debt: this should be moved into blockstack.js
function canWriteUrl(url: string, hubConfig: GaiaHubConfig): ?string {
  const readPrefix = `${hubConfig.url_prefix}${hubConfig.address}/`
  if (url.startsWith(readPrefix)) {
    return url.substring(readPrefix.length)
  } else {
    return null
  }
}

function tryUpload(
  urlToWrite: string,
  data: any,
  hubConfig: GaiaHubConfig,
  mimeType: ?string = undefined
) {
  const filenameWrite = canWriteUrl(urlToWrite, hubConfig)
  if (filenameWrite === null) {
    return null
  }
  return uploadToGaiaHub(filenameWrite, data, hubConfig, mimeType)
}

export function uploadPhoto(
  api: { gaiaHubConfig: GaiaHubConfig, gaiaHubUrl: string },
  identity: any,
  identityKeyPair: { key: string },
  photoFile: File | Blob,
  photoIndex: number
) {
  return connectToGaiaHub(api.gaiaHubUrl, identityKeyPair.key).then(identityHubConfig => {
    const globalHubConfig = api.gaiaHubConfig

    let uploadPrefix = getProfileUploadLocation(identity, identityHubConfig)
    if (uploadPrefix.endsWith('profile.json')) {
      uploadPrefix = uploadPrefix.substring(0, uploadPrefix.length - 'profile.json'.length)
    } else {
      throw new Error(`Cannot determine photo location based on profile location ${uploadPrefix}`)
    }

    const photoFilename = `avatar-${photoIndex}`
    const urlToWrite = `${uploadPrefix}/${photoFilename}`
    let uploadAttempt = tryUpload(urlToWrite, photoFile, identityHubConfig, photoFile.type)
    if (uploadAttempt === null) {
      uploadAttempt = tryUpload(urlToWrite, photoFile, globalHubConfig, photoFile.type)
    }

    // if still null, we don't know the write gaia-hub-config to write the file.
    if (uploadAttempt === null) {
      logger.error(`Wanted to write to ${urlToWrite} but I don't know how.` +
                   ' Uploading to the default path on the configured hub.')
      uploadAttempt = uploadToGaiaHub(photoFilename, photoFile, identityHubConfig, photoFile.type)
    }

    return uploadAttempt
  })
}

export function uploadProfile(
  api: { gaiaHubConfig: GaiaHubConfig, gaiaHubUrl: string },
  identity: any,
  identityKeyPair: { key: string },
  signedProfileTokenData: string
) {
  return connectToGaiaHub(api.gaiaHubUrl, identityKeyPair.key).then(identityHubConfig => {
    const urlToWrite = getProfileUploadLocation(identity, identityHubConfig)

    let uploadAttempt = tryUpload(
      urlToWrite,
      signedProfileTokenData,
      identityHubConfig,
      'application/json'
    )
    if (uploadAttempt === null) {
      uploadAttempt = tryUpload(
        urlToWrite,
        signedProfileTokenData,
        identityHubConfig,
        'application/json'
      )
    }

    // if still null, we don't know the write gaia-hub-config to write the file.
    if (uploadAttempt === null) {
      logger.error(`Wanted to write to ${urlToWrite} but I don't know how.` +
                   ' Uploading to the default path on the configured hub.')
      uploadAttempt = uploadToGaiaHub(DEFAULT_PROFILE_FILE_NAME, signedProfileTokenData,
                                      identityHubConfig, 'application/json')
    }

    return uploadAttempt
  })
}

export function uploadIdentitySettings(
  api: { gaiaHubConfig: GaiaHubConfig, gaiaHubUrl: string},
  identityKeyPair: { key: string, keyID: string },
  settingsData: string
) {
  const publicKey = identityKeyPair.keyID
  const encryptedSettingsData = encryptContent(settingsData, { publicKey })
  return connectToGaiaHub(api.gaiaHubUrl, identityKeyPair.key).then(identityHubConfig => {
    const urlToWrite = getSettingsUploadLocation(identityHubConfig)
    return tryUpload(
      urlToWrite,
      encryptedSettingsData,
      identityHubConfig,
      'application/json'
    )
  })
}

export function fetchIdentitySettings(
  api: { gaiaHubConfig: GaiaHubConfig },
  ownerAddress: string,
  identityKeyPair: { key: string }
) {
  const privateKey = identityKeyPair.key
  const hubConfig = api.gaiaHubConfig
  const url = `${hubConfig.url_prefix}${ownerAddress}/${DEFAULT_IDENTITY_SETTINGS_FILE_NAME}`
  return fetch(url)
    .then(response => response.text())
    .then(encryptedSettingsData => decryptContent(encryptedSettingsData, { privateKey }))
    .then(decryptedSettingsData => JSON.parse(decryptedSettingsData))
}
