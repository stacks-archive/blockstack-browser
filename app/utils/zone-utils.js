import { Person } from 'blockstack-profiles'
import { parseZoneFile, makeZoneFile } from 'blockstack-zones'

export function makeZoneFileForHostedProfile(origin, tokenFileUrl) {
  if (tokenFileUrl.indexOf('://') < 0) {
    throw new Error('Invalid token file url')
  }

  let zoneFile = {
    "$origin": origin,
    "$ttl": 3600,
    "uri": [
      {
        "name": "_http._tcp",
        "priority": 10,
        "weight": 1,
        "target": tokenFileUrl
      }
    ]
  }

  let zoneFileTemplate = '{$origin}\n\
{$ttl}\n\
{uri}\n\
'

  return makeZoneFile(zoneFile, zoneFileTemplate)
}

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
  let firstUriRecord = zoneFileJson.uri[0]

  if (!firstUriRecord.hasOwnProperty('target')) {
    return null
  }
  let tokenFileUrl = firstUriRecord.target

  if (tokenFileUrl.startsWith('https')) {
    // pass
  } else if (tokenFileUrl.startsWith('http')) {
    // pass
  } else {
    tokenFileUrl = 'https://' + tokenFileUrl
  }

  return tokenFileUrl
}

export function resolveZoneFileToProfile(zoneFile, publicKeychain, callback) {
  let zoneFileJson = null
  try {
    zoneFileJson = parseZoneFile(zoneFile)
    if (!zoneFileJson.hasOwnProperty('$origin')) {
      zoneFileJson = null
      throw('zone file is missing an origin')
    }
  } catch(e) {
  }

  let tokenFileUrl = null
  if (zoneFileJson && Object.keys(zoneFileJson).length > 0) {
    tokenFileUrl = getTokenFileUrlFromZoneFile(zoneFileJson)
  } else {
    let profile = null
    try {
      profile = JSON.parse(zoneFile)
      profile = Person.fromLegacyFormat(profile).profile()
    } catch(e) {
    }
    callback(profile)
    return
  }

  if (tokenFileUrl) {
    fetch(tokenFileUrl)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        let tokenRecords = responseJson
        let profile = Person.fromTokens(tokenRecords, publicKeychain).profile()
        callback(profile)
        return
      })
      .catch((error) => {
        console.warn(error)
      })
  } else {
    console.warn('Token file url not found')
    callback({})
    return
  }
}
