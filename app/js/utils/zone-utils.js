import { Person } from 'blockstack'
import { getProfileFromTokens } from './profile-utils'
import { parseZoneFile } from 'zone-file'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/zone-utils.js')
const jsontokens = require('jsontokens')

export function getTokenFileUrlFromZoneFile(zoneFileJson) {
  if (!zoneFileJson.hasOwnProperty('uri')) {
    return null
  }
  if (!Array.isArray(zoneFileJson.uri)) {
    return null
  }
  if (zoneFileJson.uri.length < 1) {
    return null
  }
  const firstUriRecord = zoneFileJson.uri[0]

  if (!firstUriRecord.hasOwnProperty('target')) {
    return null
  }
  let tokenFileUrl = firstUriRecord.target

  if (tokenFileUrl.startsWith('https')) {
    // pass
  } else if (tokenFileUrl.startsWith('http')) {
    // pass
  } else {
    tokenFileUrl = `https://${tokenFileUrl}`
  }

  return tokenFileUrl
}

export function resolveZoneFileToProfile(zoneFile, publicKeyOrAddress) {
  return new Promise((resolve, reject) => {
    let zoneFileJson = null
    try {
      zoneFileJson = parseZoneFile(zoneFile)
      if (!zoneFileJson.hasOwnProperty('$origin')) {
        zoneFileJson = null
      }
    } catch (e) {
      reject(e)
    }

    let tokenFileUrl = null
    if (zoneFileJson && Object.keys(zoneFileJson).length > 0) {
      tokenFileUrl = getTokenFileUrlFromZoneFile(zoneFileJson)
    } else {
      let profile = null
      try {
        profile = JSON.parse(zoneFile)
        profile = Person.fromLegacyFormat(profile).profile()
      } catch (error) {
        reject(error)
      }
      resolve(profile)
      return
    }

    if (tokenFileUrl) {
      proxyFetch(tokenFileUrl)
        .then((response) => response.text())
        .then((responseText) => {
           try {
              return JSON.parse(responseText)
           }
           catch (e) {
              // possibly a string-ified token 
              try {
                 const tok = jsontokens.decodeToken(responseText)
                 logger.trace('profile is encoded as a JWT')
                 return {'token': responseText}
              }
              catch (e2) {
                 throw new Error("Invalid profile: neither JSON nor JWT")
              }
           }
        })
        .then((responseJson) => {
          const tokenRecords = responseJson
          const profile = getProfileFromTokens(tokenRecords, publicKeyOrAddress)

          resolve(profile)
          return
        })
        .catch((error) => {
          logger.error(`resolveZoneFileToProfile: error fetching token file ${tokenFileUrl}`, error)
          reject(error)
        })
    } else {
      logger.warn('Token file url not found. Resolving to blank profile.')
      resolve({})
      return
    }
  })
}
