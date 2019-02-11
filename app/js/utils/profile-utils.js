import { signProfileToken, wrapProfileToken } from 'blockstack'
import { decodeToken, TokenVerifier } from 'jsontokens'

import ecurve from 'ecurve'
import { ECPair as ECKeyPair } from 'bitcoinjs-lib'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

const secp256k1 = ecurve.getCurveByName('secp256k1')

export function verifyToken(token, verifyingKeyOrAddress) {
  const decodedToken = decodeToken(token)
  const payload = decodedToken.payload

  if (!payload.hasOwnProperty('subject')) {
    throw new Error('Token doesn\'t have a subject')
  }
  if (!payload.subject.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have a subject public key')
  }
  if (!payload.hasOwnProperty('issuer')) {
    throw new Error('Token doesn\'t have an issuer')
  }
  if (!payload.issuer.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have an issuer public key')
  }
  if (!payload.hasOwnProperty('claim')) {
    throw new Error('Token doesn\'t have a claim')
  }

  const issuerPublicKey = payload.issuer.publicKey
  const publicKeyBuffer = new Buffer(issuerPublicKey, 'hex')

  const Q = ecurve.Point.decodeFrom(secp256k1, publicKeyBuffer)
  const compressedKeyPair = new ECKeyPair(null, Q, { compressed: true })
  const compressedAddress = compressedKeyPair.getAddress()
  const uncompressedKeyPair = new ECKeyPair(null, Q, { compressed: false })
  const uncompressedAddress = uncompressedKeyPair.getAddress()

  if (verifyingKeyOrAddress === issuerPublicKey) {
    // pass
  } else if (verifyingKeyOrAddress === compressedAddress) {
    // pass
  } else if (verifyingKeyOrAddress === uncompressedAddress) {
    // pass
  } else {
    throw new Error('Token issuer public key does not match the verifying value')
  }

  const tokenVerifier = new TokenVerifier(decodedToken.header.alg, issuerPublicKey)
  if (!tokenVerifier) {
    throw new Error('Invalid token verifier')
  }

  const tokenVerified = tokenVerifier.verify(token)
  if (!tokenVerified) {
    throw new Error('Token verification failed')
  }

  return decodedToken
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

export function getProfileFromTokens(tokenRecords, publicKeychain, silentVerify = true) {
  let profile = {}

  tokenRecords.map(tokenRecord => {
    let decodedToken = null

    try {
      decodedToken = decodeToken(tokenRecord.token)
      decodedToken = verifyTokenRecord(tokenRecord, publicKeychain)
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
  })

  return profile
}

export function getDefaultProfileUrl(gaiaUrlBase: string,
                                     ownerAddress: string) {
  return `${gaiaUrlBase}${ownerAddress}/profile.json`
}

/**
 * Try to fetch and verify a profile from the historic set of default locations,
 * in order of recency. If all of them return 404s, or fail to validate, return null
 */
export function fetchProfileLocations(gaiaUrlBase: string,
                                      ownerAddress: string,
                                      firstAddress: string,
                                      ownerIndex: number) {
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

export function signProfileForUpload(profile, keypair, api) {
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
        gaiaHubUrl: api.gaiaHubUrl,
        profileGaiaHubUrl: api.profileGaiaHubUrl
      }
    }
  }

  const token = signProfileToken(profile, privateKey, { publicKey })
  const tokenRecord = wrapProfileToken(token)
  const tokenRecords = [tokenRecord]
  return JSON.stringify(tokenRecords, null, 2)
}

export const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}
