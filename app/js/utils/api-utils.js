import hash from 'hash-handler'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/api-utils.js')

import { uploadProfile, BLOCKSTACK_INC } from '../account/utils'
import { signProfileForUpload } from './index'

import { isCoreEndpointDisabled } from './window-utils'

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

export function isCoreApiRunning(corePingUrl) {
  if (isCoreEndpointDisabled()) {
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
  if (isCoreEndpointDisabled()) {
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

/*
 * Insert storage driver routing information into a profile.
 * Existing routing information for this driver will be overwritten.
 *
 * TODO: this method will be rewritten/removed once Core knows about the token file
 *
 * Return the new profile.
 */
function profileInsertStorageRoutingInfo(profile, driverName, indexUrl) {
  if (!profile.account) {
    profile.account = []
  }

  for (let i = 0; i < profile.account.length; i++) {
    if (profile.account[i].identifier === 'storage' && profile.account[i].service === driverName) {
      // patch this instance
      profile.account[i].contentUrl = indexUrl
      return profile
    }
  }

  // not yet present
  const storageAccount = {
    identifier: 'storage',
    service: driverName,
    contentUrl: indexUrl
  }

  profile.account.push(storageAccount)
  return profile
}

/* Expects a JavaScript object with a key containing the config for each storage
 * provider
 * Example:
 * const config = { dropbox: { token: '123abc'} }
 */
export function setCoreStorageConfig(
  api,
  identityIndex = null,
  identityAddress = null,
  profile = null,
  profileSigningKeypair = null,
  identity = null
) {
  if (isCoreEndpointDisabled()) {
    return new Promise(resolve => {
      resolve('OK')
    })
  }

  logger.debug(`setCoreStorageConfig: ${identityIndex}, ${identityAddress}`)
  logger.debug(`setCoreStorageConfig: profile passed? ${!!profile}`)
  logger.debug(`setCoreStorageConfig: profileSigningKeypair passed? ${!!profileSigningKeypair}`)

  const coreAPIPassword = api.coreAPIPassword

  return new Promise((resolve, reject) => {
    let driverName = null
    let requestBody = null

    if (api.hostedDataLocation === BLOCKSTACK_INC) {
      driverName = 'gaia_hub'
      requestBody = { driver_config: api.gaiaHubConfig }
    } else {
      throw new Error('Only support "blockstack" driver at this time')
    }

    const url = `http://localhost:6270/v1/node/drivers/storage/${driverName}?index=1`
    const bodyText = JSON.stringify(requestBody)

    const options = {
      method: 'POST',
      host: 'localhost',
      port: '6270',
      path: `/v1/node/drivers/storage/${driverName}?index=1`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': bodyText.length,
        Authorization: authorizationHeaderValue(coreAPIPassword)
      },
      body: bodyText
    }
    logger.debug(`setCoreStorageConfig: POSTing to ${url}`)
    return fetch(url, options)
      .then(response => {
        logger.debug(`setCoreStorageConfig: got a response of ${response.status}`)
        if (!response.ok) {
          throw new Error(response.statusText)
        }
        return response
          .text()
          .then(responseText => JSON.parse(responseText))
          .then(responseJson => {
            // expect the index URL (for some drivers, like Dropbox)
            const driverConfigResult = responseJson
            const indexUrl = driverConfigResult.index_url
            logger.debug(`setCoreStorageConfig: index url? ${!!indexUrl}`)
            authorizationHeaderValue(coreAPIPassword)
            if (
              indexUrl &&
              (identityIndex || identityIndex === 0) &&
              identityAddress &&
              profile &&
              profileSigningKeypair
            ) {
              logger.debug('setCoreStorageConfig: storing index url...')
              // insert it into the profile and replicate it.
              profile = profileInsertStorageRoutingInfo(profile, driverName, indexUrl)
              const data = signProfileForUpload(profile, profileSigningKeypair)
              logger.debug('setCoreStorageConfig: uploading profile...')
              return uploadProfile(api, identity, profileSigningKeypair, data)
                .then(result => {
                  logger.debug('setCoreStorageConfig: saved index url')
                  // saved!
                  resolve(result)
                  return Promise.resolve(result)
                })
                .catch(error => {
                  logger.error('setCoreStorageConfig: error saving index url', error)
                  reject(error)
                  return Promise.reject(error)
                })
            } else {
              logger.debug('setCoreStorageConfig: not saving index url')
              // Some drivers won't return an indexUrl
              // or we'll want to initialize
              resolve('OK')
              return Promise.resolve('OK')
            }
          })
      })
      .catch(error => {
        reject(error)
      })
  })
}
