import { signProfileToken, wrapProfileToken, verifyProfileToken } from 'blockstack'
import { decodeToken } from 'jsontokens'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

export function verifyToken(token, verifyingKeyOrAddress) {
  return verifyProfileToken(token, verifyingKeyOrAddress)
}

export function verifyTokenRecord(tokenRecord, publicKeyOrAddress) {
  if (publicKeyOrAddress === null) {
    throw new Error('A public key or keychain is required')
  }

  if (typeof publicKeyOrAddress === 'string') {
    // do nothing
  } else {
    throw new Error('A valid address or public key is required')
  }

  const decodedToken = verifyToken(tokenRecord.token, publicKeyOrAddress)

  return decodedToken
}

export async function getProfileFromTokens(tokenRecords, publicKeychain, silentVerify = true) {
  let profile = {}

  const decodeRecord = async (tokenRecord) => {
    let decodedToken = null

    try {
      decodedToken = decodeToken(tokenRecord.token)
      decodedToken = await verifyTokenRecord(tokenRecord, publicKeychain)
    } catch (error) {
      if (!silentVerify) {
        throw error
      } else {
        console.warn(error)
      }
    }

    if (decodedToken !== null) {
      profile = Object.assign({}, profile, decodedToken.payload.claim)
    }

    return null
  }

  const tokenDecodes = tokenRecords.map(tokenRecord => decodeRecord(tokenRecord))
  await Promise.all(tokenDecodes)

  return profile
}

export function getDefaultProfileUrl(gaiaUrlBase,
                                     ownerAddress) {
  return `${gaiaUrlBase}${ownerAddress}/profile.json`
}

/**
 * Try to fetch and verify a profile from the historic set of default locations,
 * in order of recency. If all of them return 404s, or fail to validate, return null
 */
export function fetchProfileLocations(gaiaUrlBase,
                                      ownerAddress,
                                      firstAddress,
                                      ownerIndex) {
  function recursiveTryFetch(locations) {
    if (locations.length === 0) {
      return Promise.resolve(null)
    }
    const location = locations[0]
    return fetch(location)
      .then(response => {
        if (response.ok) {
          return response.json()
            .then(tokenRecords => getProfileFromTokens(tokenRecords, ownerAddress, false))
            .then(profile => {
              logger.debug(`Found valid profile at ${location}`)
              return { profile, profileUrl: location }
            })
            .catch(() => {
              logger.debug(`Failed to verify profile at ${location}... trying others`)
              return recursiveTryFetch(locations.slice(1))
            })
        } else {
          logger.debug(`Failed to find profile at ${location}... trying others`)
          return recursiveTryFetch(locations.slice(1))
        }
      })
      .catch(() => {
        logger.debug(`Error in fetching profile at ${location}... trying others`)
        return recursiveTryFetch(locations.slice(1))
      })
  }

  const urls = []
  // the new default
  urls.push(getDefaultProfileUrl(gaiaUrlBase, ownerAddress))

  // the 'indexed' URL --
  //  this is gaia/:firstAddress/:index/profile.json
  //  however, the index is _not_ equal to the current index.
  //  indexes were mapped from
  //    correct: [0, 1, 3, 5, 7, 9...]
  //  incorrect: [0, 1, 2, 3, 4, 5...]

  if (ownerIndex < 2) {
    urls.push(`${gaiaUrlBase}${firstAddress}/${ownerIndex}/profile.json`)
  } else if (ownerIndex % 2 === 1) {
    const buggedIndex = 1 + Math.floor(ownerIndex / 2)
    urls.push(`${gaiaUrlBase}${firstAddress}/${buggedIndex}/profile.json`)
  }

  return recursiveTryFetch(urls)
}

export async function signProfileForUpload(profile, keypair, api) {
  const privateKey = keypair.key
  const publicKey = keypair.keyID

  if (profile.api && profile.api.gaiaHubConfig) {
    profile.api.gaiaHubConfig = {
      url_prefix: profile.api.gaiaHubConfig.url_prefix
    }
  }

  if (api) {
    profile = {
      ...profile,
      api: {
        gaiaHubConfig: {
          url_prefix: api.gaiaHubConfig.url_prefix
        },
        gaiaHubUrl: api.gaiaHubUrl
      }
    }
  }

  const token = await signProfileToken(profile, privateKey, { publicKey })
  const tokenRecord = wrapProfileToken(token)
  const tokenRecords = [tokenRecord]
  return JSON.stringify(tokenRecords, null, 2)
}

export const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}
