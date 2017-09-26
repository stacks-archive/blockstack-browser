
import hash from 'hash-handler'
import log4js from 'log4js'

const logger = log4js.getLogger('utils/api-utils.js')

import { uploadProfile, DROPBOX, BLOCKSTACK_INC } from '../account/utils'
import { signProfileForUpload } from './index'

import { keyFileCreate, keyFileParse, keyFileProfileSerialize, keyFileUpdateApps, keyFileMakeDelegationPrivateKeys, keyFileICANNToAppName, getPubkeyHex, datastoreMountOrCreate } from 'blockstack'
const jsontokens = require('jsontokens')
const assert = require('assert')

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
export function setCoreStorageConfig(api,
  blockchainId = null, profile = null, profileSigningKeypair = null) {
  return new Promise((resolve, reject) => {
    var driverName = null;
    var requestBody = null;

    if (api.hostedDataLocation === DROPBOX) {
      driverName = 'dropbox'
      requestBody = { driver_config: { token: api.dropboxAccessToken } }
    }else if (api.hostedDataLocation === BLOCKSTACK_INC) {
      driverName = 'gaia_hub'
      requestBody = { driver_config: api.gaiaHubConfig }
    }else{
      throw new Error('Only support "dropbox" or "blockstack" driver at this time')
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
        Authorization: authorizationHeaderValue(api.coreAPIPassword)
      },
      body: bodyText
    }

    return fetch(url, options)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(response.statusText)
      }
      return response.text()
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
         // expect the index URL (for some drivers, like Dropbox)
          const driverConfigResult = responseJson

          if (driverConfigResult.index_url && profile && blockchainId) {
            // insert it into the profile and replicate it.
            profile = profileInsertStorageRoutingInfo(profile,
              driverName, driverConfigResult.index_url)
            const data = signProfileForUpload(profile, profileSigningKeypair)

            return uploadProfile(api, blockchainId, data)
            .then((result) => {
              // saved!
              resolve(result)
            })
            .catch((error) => {
              reject(error)
            })
          } else {
            // Some drivers won't return an indexUrl
            // or we'll want to initialize
            resolve('OK')
          }
        })
    })
    .catch((error) => {
      reject(error)
    })
  })
}


/*
 * Set up the datastore for this app.
 * If we created it for the first time, then update the profile as well
 * with a new keyfile.
 *
 * Returns the new profile on success, *if* we create the datastore and have to update the profile.
 * Returns null otherwise.
 * Throws on error.
 */
export function setupAppDatastore(api, profile, sessionToken, identityAddress, identityAddressIndex, signingKeypair,
                           appPrivateKey, apiPassword, replicationStrategy={'publish': 1, 'local': 1, 'drivers': ['dropbox', 'disk']}) {
   return new Promise((resolve, reject) => {
      const session = jsontokens.decodeToken(sessionToken).payload
      const blockchainId = session.blockchain_id
      const deviceId = session.device_id
      const appName = session.app_domain
      const datastoreId = session.app_user_id

      assert(deviceId, 'Invalid session: missing device ID')
      assert(appName, 'Invalid session: missing application name')
      assert(datastoreId, 'Invalid session: missing datastore ID')

      // does this profile have a keyfile yet?
      if (!profile.keyfile) {
         logger.trace('Profile does not have a keyfile yet; creating one')
         
         const keyfileToken = keyFileCreate(signingKeypair, deviceId, {'profile': profile, 'index': identityAddressIndex})
         profile = jsontokens.decodeToken(keyfileToken)['payload']['claim']
         assert(profile, `BUG: invalid keyfileToken ${keyfileToken}`)
      }

      datastoreMountOrCreate(replicationStrategy, sessionToken, appPrivateKey, apiPassword)
      .then((datastoreInfo) => {
         if (datastoreInfo.error) {
            reject(`Failed to create datastore: ${datastoreInfo.error}`)
         }
         else {
            // URLs will be set if we created it for the first time 
            if (datastoreInfo.created) {
                assert(datastoreInfo.urls.root, 'Datastore is missing root directory URLs')
                assert(datastoreInfo.urls.datastore, 'Datastore is missing datastore control record URLs')

                logger.trace(`created datastore! roots at ${datastoreInfo.urls.root.join(',')}, datastore records at ${datastoreInfo.urls.datastore.join(',')}`)
                
                // re-construct the serialized keyfile-bearing profile and extract it
                const delegationKeys = keyFileMakeDelegationPrivateKeys(signingKeypair, identityAddressIndex)
                const profileToken = keyFileProfileSerialize(profile, delegationKeys['sign'])
                
                logger.trace(`current profile token for ${identityAddress}: ${profileToken}`);
                const parsedProfile = keyFileParse(profileToken, identityAddress)
                assert(parsedProfile, 'Failed to parse profile')

                const appPublicKey = getPubkeyHex(appPrivateKey)
               
                // insert the application data
                const newProfileToken = keyFileUpdateApps(parsedProfile, deviceId, keyFileICANNToAppName(appName), appPublicKey, deviceId,
                                                          datastoreId, datastoreInfo.urls.datastore, datastoreInfo.urls.root, delegationKeys['sign'])

                assert(newProfileToken, 'Failed to add application to profile keyfile')

                // update the key file with this info 
                uploadProfile(api, blockchainId, newProfileToken).then(() => {
                   resolve(newProfileToken);
                })
                .catch((error) => {
                   // creating the datastore technically failed, since it's not discoverable (i.e. we replicated the datastore
                   // metadata and records, but not the keyfile-containing profile that points to them).
                   // Make sure that we retry creating this datastore.
                   datastoreCreateSetRetry(sessionToken);
                   reject(error);
                })
            }
            else {
                // already exists
                resolve(null);
            }
         }
      })
   })
}

