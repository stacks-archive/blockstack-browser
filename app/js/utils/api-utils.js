import hash from 'hash-handler'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/api-utils.js')

export function getNamesOwned(address, addressLookupUrl, callback) {
  const url = addressLookupUrl.replace('{address}', address)
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
    fetch(corePingUrl)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      if (responseJson.status === 'alive') {
        resolve(true)
      } else {
        resolve(false)
      }
    })
    .catch((error) => {
      logger.error(`isCoreApiRunning: problem checking ${corePingUrl}`, error)
      resolve(false)
    })
  })
}
/*
export function getIdentities(address, addressLookupUrl, localIdentities, callback) {
  let remoteNamesDict = {},
      localNamesDict = {},
      newNames = []

  getNamesOwned(address, addressLookupUrl, function(namesOwned) {
    namesOwned.map(function(name) {
      remoteNamesDict[name] = true
    })

    localIdentities.map(function(identity) {
      localNamesDict[identity.id] = true
      if (remoteNamesDict.hasOwnProperty(identity.id)) {
        identity[registered] = true
      }
    })

    namesOwned.map(function(name) {
      if (!localNamesDict.hasOwnProperty(name)) {
        localIdentities.push({
          index: localIdentities.length,
          id: name,
          registered: true
        })
      }
    })

    callback(localIdentities, newNames)
  })
}*/
