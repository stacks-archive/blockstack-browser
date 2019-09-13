import { 
  connectToGaiaHub, 
  uploadToGaiaHub, 
  encryptContent, 
  decryptContent, 
  hexStringToECPair, 
  GAIA_HUB_COLLECTION_KEY_FILE_NAME
} from 'blockstack'

const DEFAULT_NEW_COLLECTION_SETTING_ARRAY = [{
  identifier: 'default',
  encryptionKeyIndex: 0
}]

const ARCHIVAL_GAIA_AUTH_SCOPE = 'putFileArchivalPrefix'
const COLLECTION_GAIA_PREFIX = 'collection'

export function getCollectionEncryptionIndex(collectionName, settings, updateIdentityCollectionSettings) {
  if(!settings.collection 
    || !settings.collection[collectionName] 
    || settings.collections[collectionName].length > 0) {
    const defaultCollectionSettings = DEFAULT_NEW_COLLECTION_SETTING_ARRAY
    updateIdentityCollectionSettings(collectionName, defaultCollectionSettings)
    return Promise.resolve(defaultCollectionSettings[0].encryptionKeyIndex)
  } else {
    const collectionSetting = settings.collections[collectionName]
    return Promise.resolve(collectionSetting[0].encryptionKeyIndex)
  }
}

export function fetchOrCreateCollectionKeys(scopes, node, settings, updateIdentityCollectionSettings) {
  const collectionKeyPromises = scopes.map((scope) => 
    getCollectionEncryptionIndex(scope, settings, updateIdentityCollectionSettings)
    .then((encryptionKeyIndex) => {
      const collectionEncryptionPrivateKey = 
        node.getCollectionEncryptionNode(scope, encryptionKeyIndex).getCollectionPrivateKey()
      return Promise.resolve(collectionEncryptionPrivateKey)
    })
  )
  return Promise.all(collectionKeyPromises)
}

export function getCollectionGaiaHubConfigs(scopes, node, gaiaHubUrl) {
  const hubConfigPromises = scopes.map((scope) => {
    const collectionPrivateKey = 
    node.getCollectionNode(scope).getCollectionPrivateKey()
    const gaiaScopes = [{ 
      scope: ARCHIVAL_GAIA_AUTH_SCOPE, 
      domain: COLLECTION_GAIA_PREFIX 
    }]
    return connectToGaiaHub(gaiaHubUrl, collectionPrivateKey, '', gaiaScopes)
  })

  return Promise.all(hubConfigPromises)
}

function writeCollectionKeysToAppStorage(appPrivateKey, hubConfig, keyFile) {
  const compressedAppPrivateKey = `${appPrivateKey}01`
  const keyPair = hexStringToECPair(compressedAppPrivateKey)
  const publicKey = keyPair.publicKey.toString('hex')
  const encryptedKeyFile = encryptContent(JSON.stringify(keyFile), { publicKey })

  return uploadToGaiaHub(
    GAIA_HUB_COLLECTION_KEY_FILE_NAME, 
    encryptedKeyFile, 
    hubConfig, 
    'application/json'
  )
}

function getAppCollectionKeyFile(appPrivateKey, gaiaHubBucketUrl, appBucketAddress) {
  const keyFileUrl = `${gaiaHubBucketUrl}${appBucketAddress}/${GAIA_HUB_COLLECTION_KEY_FILE_NAME}`
  return fetch(keyFileUrl)
    .then(response => {
      if (response.ok) {
        return response.text()
          .then(encryptedKeyFile => decryptContent(encryptedKeyFile, { privateKey: appPrivateKey }))
          .then(decryptedKeyFile => JSON.parse(decryptedKeyFile))
      } else if (response.status === 404) {
        return {}
      } else {
        return Promise.reject('Could not get collection key file')
      }
    })
}

function updateAppCollectionKeys(
  collectionScopes, 
  appPrivateKey, 
  gaiaHubUrl, 
  collectionKeys, 
  collectionHubConfigs
) {
  return connectToGaiaHub(gaiaHubUrl, appPrivateKey).then(hubConfig => 
    getAppCollectionKeyFile(appPrivateKey, hubConfig.url_prefix, hubConfig.address)
      .then((keyFile) => {
        collectionScopes.map((scope, index) => {
          keyFile[scope] = {
            encryptionKey: collectionKeys[index],
            hubConfig: collectionHubConfigs[index]
          }
          return true
        })
        return keyFile
      })
      .then(keyFile => writeCollectionKeysToAppStorage(appPrivateKey, hubConfig, keyFile))
  )
}

export function processCollectionScopes(
  appPrivateKey,
  collectionScopes,
  collectionsNode,
  gaiaHubUrl,
  identitySettings,
  updateIdentityCollectionSettings
) {
  const encryptionKeyPromise = 
    fetchOrCreateCollectionKeys(
      collectionScopes, 
      collectionsNode, 
      identitySettings, 
      updateIdentityCollectionSettings
    )
  const hubConfigsPromise = 
    getCollectionGaiaHubConfigs(collectionScopes, collectionsNode, gaiaHubUrl)
  return Promise.all([encryptionKeyPromise, hubConfigsPromise])
    .then(results => {
      const collectionKeys = results[0]
      const collectionHubConfigs = results[1]
      return updateAppCollectionKeys(
        collectionScopes,
        appPrivateKey, 
        gaiaHubUrl, 
        collectionKeys, 
        collectionHubConfigs
      )
    })
}








