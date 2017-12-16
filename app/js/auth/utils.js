// @flow

import log4js from 'log4js'
import { isLaterVersion } from 'blockstack'

const logger = log4js.getLogger('auth/components/util.js')


const VALID_SCOPES = {
  store_write: true,
  email: true
}

export function appRequestSupportsDirectHub(
  requestPayload: {version: string, supports_hub_url: boolean}): boolean {
  return isLaterVersion(requestPayload.version, '1.2.0') ||
    !!requestPayload.supports_hub_url
}

export function validateScopes(scopes: Array<string>): boolean {
  logger.trace('validateScopes')

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
