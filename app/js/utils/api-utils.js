import hash from 'hash-handler'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/api-utils.js')

import {
  DEFAULT_CORE_API_ENDPOINT, REGTEST_CORE_API_ENDPOINT, REGTEST_CORE_API_PASSWORD,
  DEFAULT_CORE_PHONY_PASSWORD }  from '../account/store/settings/default'

import { isCoreEndpointDisabled } from './window-utils'
import { BLOCKSTACK_STATE_VERSION_KEY } from '../App'

export function authorizationHeaderValue(coreAPIPassword) {
  return `bearer ${coreAPIPassword}`
}

export function getCoreAPIPasswordFromURL() {
  const coreAPIPassword = hash.getInstance().get('coreAPIPassword')
  if (!coreAPIPassword || coreAPIPassword === 'off') {
    return null
  }
  hash.getInstance().set('coreAPIPassword', 'off')
  return coreAPIPassword
}

export function getLogServerPortFromURL() {
  const logServerPort = hash.getInstance().get('logServerPort')
  if (!logServerPort || logServerPort === 'off') {
    return null
  }
  hash.getInstance().set('logServerPort', 'off')
  return logServerPort
}

export function getRegTestModeFromURL() {
  const regTestMode = hash.getInstance().get('regtest')
  if (!regTestMode || regTestMode === 'off') {
    return null
  }
  hash.getInstance().set('regtest', 'off')
  return regTestMode === '1'
}

function findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl) {
  const apiOut = Object.assign({}, api, { regTestMode, coreAPIPassword })
  Object.keys(apiOut)
    .forEach(key => {
      const value = apiOut[key]
      if (typeof value === 'string' || value instanceof String) {
        if (value.startsWith(toFindUrl)) {
          const suffix = value.slice(toFindUrl.length)
          apiOut[key] = `${toSetUrl}${suffix}`
        }
      }
    })

  return apiOut
}

/**
 * Returns an API object with regTestMode set to the inputted value,
 *  and URLs all changed to either match DEFAULT_CORE_API_ENDPOINT
 *  or REGTEST_CORE_API_ENDPOINT respectively.
 *
 * This is intended _only_ as a stopgap implementation. Realistically,
 *  we need a more sophisticated regtest mode, which will restore
 *  to the correct URLs
 * @parameter {Object} the previous api object
 * @parameter {Object} the new value of the regTestMode
 * @returns {Object} a new api object
 * @private
 */
export function setOrUnsetUrlsToRegTest(api, regTestMode) {
  let toFindUrl
  let toSetUrl
  let coreAPIPassword
  if (regTestMode) {
    toFindUrl = DEFAULT_CORE_API_ENDPOINT
    toSetUrl = REGTEST_CORE_API_ENDPOINT
    coreAPIPassword = REGTEST_CORE_API_PASSWORD
  } else {
    toFindUrl = REGTEST_CORE_API_ENDPOINT
    toSetUrl = DEFAULT_CORE_API_ENDPOINT
    coreAPIPassword = DEFAULT_CORE_PHONY_PASSWORD
  }
  return findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl)
}

/*
 * Returns true if the current state version is a legacy version
 *  which relies on localhost:6270 -- this is true if the
 *  existing state version is < 13 (when we migrated away from shipping a
 *  local api endpoint)
 * @returns {boolean}
 * @private
 */
export function hasLegacyCoreStateVersion() {
  let existingVersion = localStorage.getItem(BLOCKSTACK_STATE_VERSION_KEY)
  if (!existingVersion) {
    existingVersion = 0
  }
  return existingVersion < 13
}

/**
 * Migrates an API object from old default URLs to the new
 *  default. Used in migrating from localhost:6270 default to
 *  core.blockstack.org (happened at v0.28.0)
 * @parameter {Object} the previous api object
 * @returns {Object} a new api object
 * @private
 */
export function migrateLegacyCoreEndpoints(api) {
  // State version 13 is when we migrated away from default localhost:6270
  console.log('Migrating URLs from localhost:6270 to core.blockstack.org')
  const regTestMode = api.regTestMode
  const toFindUrl = 'http://localhost:6270'
  const toSetUrl = DEFAULT_CORE_API_ENDPOINT
  const coreAPIPassword = DEFAULT_CORE_PHONY_PASSWORD
  const outApi = findAndSetApiUrls(api, regTestMode, coreAPIPassword, toFindUrl, toSetUrl)
  console.log(JSON.stringify(outApi))
  return outApi
}

export function isCoreApiRunning(corePingUrl) {
  if (isCoreEndpointDisabled(corePingUrl)) {
    return new Promise(resolve => {
      resolve(true)
    })
  }

  logger.debug(`isCoreApiRunning: ${corePingUrl}`)

  return new Promise(resolve => {
    fetch(corePingUrl, { cache: 'no-store' })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        if (responseJson.status === 'alive') {
          logger.trace('isCoreApiRunning? Yes!')
          resolve(true)
        } else {
          logger.error('isCoreApiRunning? No!')
          resolve(false)
        }
      })
      .catch(error => {
        logger.error(`isCoreApiRunning: problem checking ${corePingUrl}`, error)
        resolve(false)
      })
  })
}

export function isApiPasswordValid(corePasswordProtectedReadUrl, coreApiPassword) {
  if (isCoreEndpointDisabled(corePasswordProtectedReadUrl)) {
    return new Promise(resolve => {
      resolve(true)
    })
  }

  logger.debug(`isApiPasswordValid: ${corePasswordProtectedReadUrl}`)

  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authorizationHeaderValue(coreApiPassword)
  }

  return new Promise(resolve => {
    if (!coreApiPassword) {
      logger.error('isCoreApiPasswordValid? Password is missing!')
      resolve(false)
      return
    }
    fetch(corePasswordProtectedReadUrl, {
      cache: 'no-store',
      headers: requestHeaders
    })
      .then(response => {
        if (response.ok) {
          logger.trace('isCoreApiPasswordValid? Yes!')
          resolve(true)
        } else {
          logger.error('isCoreApiPasswordValid? No!')
          resolve(false)
        }
      })
      .catch(error => {
        logger.error(`isApiPasswordValid: problem checking ${corePasswordProtectedReadUrl}`, error)
        resolve(false)
      })
  })
}

/* Expects a JavaScript object with a key containing the config for each storage
 * provider
 * Example:
 * const config = { dropbox: { token: '123abc'} }
 */
export function setCoreStorageConfig() {
  logger.debug('setCoreStorageConfig called in a core-less build')
  return Promise.resolve('OK')
}
