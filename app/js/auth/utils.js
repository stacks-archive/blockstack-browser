// @flow

import log4js from 'log4js'
import {
  isLaterVersion,
  getPublicKeyFromPrivate
} from 'blockstack'

const logger = log4js.getLogger(__filename)

import {
  randomBytes
} from 'crypto'

import {
  TokenSigner
} from 'jsontokens'

const VALID_SCOPES = {
  store_write: true,
  email: true,
  publish_data: true
}

export function appRequestSupportsDirectHub(requestPayload: Object): boolean {
  let version = '0'
  let supportsHubUrl = false
  if (requestPayload.hasOwnProperty('version')) {
    version = requestPayload.version
  }
  if (requestPayload.hasOwnProperty('supports_hub_url')) {
    supportsHubUrl = requestPayload.supports_hub_url
  }

  return isLaterVersion(version, '1.2.0') || !!supportsHubUrl
}

export function validateScopes(scopes: Array<string>): boolean {
  logger.info('validateScopes')

  if (!scopes) {
    logger.error('validateScopes: no scopes provided')
    return false
  }

  if (scopes.length === 0) {
    return true
  }

  let valid = false
  for (let i = 0; i < scopes.length; i++) {
    const scope = scopes[i]
    if (VALID_SCOPES[scope] === true) {
      valid = true
    } else {
      return false
    }
  }
  return valid
}

export function makeGaiaAssociationToken(secretKeyHex: string, childPublicKeyHex: string) {
  const LIFETIME_SECONDS = 91 * 24 * 3600
  const signerKeyHex = secretKeyHex.slice(0, 64)
  const compressedPublicKeyHex = getPublicKeyFromPrivate(signerKeyHex)
  const salt = randomBytes(16).toString('hex')
  const payload = { childToAssociate: childPublicKeyHex,
                    iss: compressedPublicKeyHex,
                    exp: LIFETIME_SECONDS + (new Date()/1000),
                    iat: Date.now()/1000,
                    salt }

  const token = new TokenSigner('ES256K', signerKeyHex).sign(payload)
  return token
}
