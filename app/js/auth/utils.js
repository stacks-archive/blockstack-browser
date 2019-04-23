// @flow

import log4js from 'log4js'
import { isLaterVersion } from 'blockstack'

const logger = log4js.getLogger(__filename)

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
