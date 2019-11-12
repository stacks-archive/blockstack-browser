// @flow
import { parseZoneFile } from 'zone-file'

import type { GaiaHubConfig } from './blockstack-inc'
import { connectToGaiaHub, uploadToGaiaHub } from './blockstack-inc'

import { getTokenFileUrlFromZoneFile, resolveZoneFileToProfile } from '@utils/zone-utils'
import { fetchProfileLocations, getDefaultProfileUrl } from '@utils/profile-utils'

import DEFAULT_API from '../store/settings/default'
const DEFAULT_GAIA_HUB_URL = DEFAULT_API.gaiaHubUrl

import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

export const BLOCKSTACK_INC = 'gaia-hub'
const DEFAULT_PROFILE_FILE_NAME = 'profile.json'

async function connectDefaultGaiaHub(identityKey) {
  const hubConfig = await connectToGaiaHub(DEFAULT_GAIA_HUB_URL, identityKey)
  logger.debug(`getProfileForDefaultGaiaHub connectToGaiaHub: ${JSON.stringify(hubConfig)}`)
  return hubConfig
}

// matt-debt: this should be in blockstack.js
async function getDefaultGaiaHubInfo() {
  const hubInfoResponse = await fetch(`${DEFAULT_GAIA_HUB_URL}/hub_info`)
  const hubInfoJson = await hubInfoResponse.json()
  return {
    gaiaHubConfig: {
      url_prefix: hubInfoJson.read_url_prefix
    }, 
    gaiaHubUrl: DEFAULT_GAIA_HUB_URL
  }
}

/**
 * Performs a `connectToGaiaHub` after determining the most up-to-date gaia hub 
 * server for a given `address`. 
 * First tries:
 *   1. Fetch `names` for the `address` with `bitcoinAddressLookupUrl`. 
 *   2. Fetch zonefile with `nameLookupUrl` using the first name returned. 
 *   3. Parse zonefile for the `profile.json` url. 
 *   4. Fetch the profile and get the `gaiaHubUrl` value. 
 * 
 * In some situations one or more parts of this resolution chain will be unavailable. 
 * Examples: 
 *   * Pending name registration (address but no name/zonefile available).
 *   * Legacy zonefile not containing a `profile.json` url. 
 *   * Legacy `profile.json` file not containing a gaiaHubUrl.
 * 
 * In these situations, the locally cached identities will be checked for a 
 * matching address which may contain the gaiaHubUrl settings while the name 
 * is pending registration. 
 * 
 * If still not found then the default Gaia Hub server is used. 
 * 
 * @param {string} address Identity public address
 * @param {string} key Identity private key
 * @param {Array<object>} localIdentities 
 * The identities from the cached app state. Only used if the address is not resolving to a name. 
 * Useful during a pending name registration, when the app has the gaia hub settings cached locally. 
 */
export async function resolveGaiaHubConfigForAddress(
  address: string, 
  key: string,
  bitcoinAddressLookupUrl: string,
  nameLookupUrl: string,
  localIdentities: any[]
) {
  let profile = null
  const addressLookupUrl = bitcoinAddressLookupUrl.replace('{address}', address)
  logger.debug(`resolveGaiaHubConfigForAddress: fetching ${addressLookupUrl}`)
  const addressResponse = await fetch(addressLookupUrl)
  const addressResponseJson = await addressResponse.json()
  if (addressResponseJson.names.length === 0) {
    // No names owned by address - likely a pending registration. 
    // Local app state cache then default gaia hub will be checked. 
    logger.debug(`resolveGaiaHubConfigForAddress: ${address} owns no names`)
  } else {
    if (addressResponseJson.names.length === 1) {
      logger.debug(`resolveGaiaHubConfigForAddress: ${address} has 1 name`)
    } else {
      logger.debug(
        `resolveGaiaHubConfigForAddress: ${address} has multiple names. Only using 0th`
      )
    }
    const nameOwned = addressResponseJson.names[0]
    const formattedNameLookupUrl = nameLookupUrl.replace('{name}', nameOwned)
    logger.debug(`resolveGaiaHubConfigForAddress: fetching: ${formattedNameLookupUrl}`)
    const nameLookupResponse = await fetch(formattedNameLookupUrl)
    const nameLookupJson = await nameLookupResponse.json()
    const zoneFile = nameLookupJson.zonefile
    const ownerAddress = nameLookupJson.address
    logger.debug(
      `resolveGaiaHubConfigForAddress: resolving zonefile of ${nameOwned} to profile`
    )
    const resolvedProfile = await resolveZoneFileToProfile(zoneFile, ownerAddress)
    if (!resolvedProfile || Object.keys(resolvedProfile).length === 0) {
      // Legacy zonefile did not contain a profile.json url. 
      logger.warn('resolveGaiaHubConfigForAddress: resolveZoneFileToProfile did not find profile, checking default locations')
    } else {
      profile = resolvedProfile
    }
  }

  if (!profile) {
    // Check locally cached identities from the app state for a matching profile. 
    // This should only really happen in the name is pending registration (so no zonefile is available),
    // but the app state cached the gaiaHubUrl. 
    logger.debug('resolveGaiaHubConfigForAddress: checking localIdentities for cached profile')
    if (localIdentities && localIdentities.length > 0) {
      const matchingIdentity = localIdentities.find(identity => identity.ownerAddress === address)
      if (matchingIdentity) {
        logger.debug('resolveGaiaHubConfigForAddress: found local identity with matching owner address')
        if (matchingIdentity.profile) {
          profile = matchingIdentity.profile
        } else {
          logger.debug('resolveGaiaHubConfigForAddress: local identity with matching owner address did not contain a profile')
        }
      } else {
        logger.warn('resolveGaiaHubConfigForAddress: no matching local identity, checking default locations')
      }
    }
  }

  if (!profile) {
    // Use the default gaia hub with `fetchProfileLocations` which checks possible legacy profile.json locations. 
    let identityIndex = 0
    const defaultGaiaHubInfo = await getDefaultGaiaHubInfo()
    let ownerAccountAddress = address
    if (localIdentities && localIdentities.length > 0 && localIdentities[0].ownerAddress) {
      ownerAccountAddress = localIdentities[0].ownerAddress
      identityIndex = localIdentities.findIndex(ident => ident.ownerAddress === address)
      if (identityIndex < 0) {
        identityIndex = 0
      }
    }
    const locationResponse = await fetchProfileLocations(
      defaultGaiaHubInfo.gaiaHubConfig.url_prefix,
      address,
      ownerAccountAddress,
      identityIndex
    )
    if (locationResponse && locationResponse.profile) {
      logger.debug(`resolveGaiaHubConfigForAddress: fetchProfileLocations found result: ${locationResponse.profileUrl}`)
      profile = locationResponse.profile
    } else {
      logger.warn('resolveGaiaHubConfigForAddress: fetchProfileLocations could not find any profile locations, using default hub')
      // Could not find profile.json, return the default gaia hub config. 
      return connectDefaultGaiaHub(key)
    }
  }

  let gaiaHubUrl = profile.api && profile.api.gaiaHubUrl
  if (!gaiaHubUrl) {
    // profile.json is legacy and does not contain a gaiaHubUrl, use the default gaia hub. 
    logger.warn('resolveGaiaHubConfigForAddress: profile does not specify a gaia hub url, using default hub')
    gaiaHubUrl = DEFAULT_GAIA_HUB_URL
  } else {
    logger.debug(`resolveGaiaHubConfigForAddress: connecting to gaiaHub in profile: found result: ${gaiaHubUrl}`)
  }
  const gaiaHubConfig = await connectToGaiaHub(gaiaHubUrl, key)
  return gaiaHubConfig
}

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
  gaiaHubConfig: any,
  identity: any,
  photoFile: File | Blob,
  photoIndex: number
) {
  let uploadPrefix = getProfileUploadLocation(identity, gaiaHubConfig)
  if (uploadPrefix.endsWith('profile.json')) {
    uploadPrefix = uploadPrefix.substring(0, uploadPrefix.length - 'profile.json'.length)
  } else {
    throw new Error(`Cannot determine photo location based on profile location ${uploadPrefix}`)
  }

  const photoFilename = `avatar-${photoIndex}`
  const urlToWrite = `${uploadPrefix}/${photoFilename}`
  let uploadAttempt = tryUpload(urlToWrite, photoFile, gaiaHubConfig, photoFile.type)

  // if still null, we don't know the write gaia-hub-config to write the file.
  if (uploadAttempt === null) {
    logger.error(`Wanted to write to ${urlToWrite} but I don't know how.` +
                  ' Uploading to the default path on the configured hub.')
    uploadAttempt = uploadToGaiaHub(photoFilename, photoFile, gaiaHubConfig, photoFile.type)
  }

  return uploadAttempt
}

/**
 * @param {Object} gaiaHubConfig The resolved result from `blockstack.connectToGaiaHub`
 */
export async function uploadProfile(
  gaiaHubConfig: any,
  identity: any,
  signedProfileTokenData: string
) {
  logger.debug(`uploadProfile: ${gaiaHubConfig.server}, ${gaiaHubConfig.url_prefix}`)
  
  // Returns the profile.json file url in the zonefile if it is available.
  // If not available its probably from missing or pending registration,
  // if so the expected location of the profile.json is returned. 
  const urlToWrite = getProfileUploadLocation(identity, gaiaHubConfig)

  // First try uploading to the profile location specified in the zonefile, if available
  let uploadAttempt = tryUpload(
    urlToWrite,
    signedProfileTokenData,
    gaiaHubConfig,
    'application/json'
  )

  // if still null, we don't know the write gaia-hub-config to write the file.
  if (uploadAttempt === null) {
    logger.error(`Wanted to write to ${urlToWrite} but I don't know how.` +
                  ' Uploading to the default path on the configured hub.')
    uploadAttempt = uploadToGaiaHub(DEFAULT_PROFILE_FILE_NAME, signedProfileTokenData,
                                    gaiaHubConfig, 'application/json')
  }

  return uploadAttempt

}

export { connectToGaiaHub }
