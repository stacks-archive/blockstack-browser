import hash from 'hash-handler'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/api-utils.js')

export function getNamesOwned(address, bitcoinAddressLookupUrl, callback) {
  const url = bitcoinAddressLookupUrl.replace('{address}', address)
  fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      callback([])
    })
    .catch((error) => {
      logger.error('getNamesOwned: error', error)
      callback([])
    })
}

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

export function isCoreApiRunning(corePingUrl) {
  logger.debug(`isCoreApiRunning: ${corePingUrl}`)
  return new Promise((resolve) => {
    fetch(corePingUrl, { cache: 'no-store' })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      if (responseJson.status === 'alive') {
        logger.trace('isCoreApiRunning? Yes!')
        resolve(true)
      } else {
        logger.error('isCoreApiRunning? No!')
        resolve(false)
      }
    })
    .catch((error) => {
      logger.error(`isCoreApiRunning: problem checking ${corePingUrl}`, error)
      resolve(false)
    })
  })
}

export function isApiPasswordValid(corePasswordProtectedReadUrl, coreApiPassword) {
  logger.debug(`isApiPasswordValid: ${corePasswordProtectedReadUrl}`)

  const requestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: authorizationHeaderValue(coreApiPassword)
  }

  return new Promise((resolve) => {
    if (!coreApiPassword) {
      logger.error('isCoreApiPasswordValid? Password is missing!')
      resolve(false)
      return
    }
    fetch(corePasswordProtectedReadUrl, {
      cache: 'no-store',
      headers: requestHeaders
    })
    .then((response) => {
      if (response.ok) {
        logger.trace('isCoreApiPasswordValid? Yes!')
        resolve(true)
      } else {
        logger.error('isCoreApiPasswordValid? No!')
        resolve(false)
      }
    })
    .catch((error) => {
      logger.error(`isApiPasswordValid: problem checking ${corePasswordProtectedReadUrl}`,
        error)
      resolve(false)
    })
  })
}
