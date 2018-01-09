// @flow
import log4js from 'log4js'
import { uploadToGaiaHub, connectToGaiaHub, GaiaHubConfig } from 'blockstack'

const logger = log4js.getLogger('account/utils/blockstack-inc.js')

export function uploadPhotoToGaiaHub(api: {gaiaHubConfig: GaiaHubConfig },
  identityIndex: number, identityAddress: string, photoFile: any, photoIndex: number) {
  logger.trace('uploadPhotoToGaiaHub')
  const hubConfig = api.gaiaHubConfig
  const filename = `${identityIndex}/avatar-${photoIndex}`
  return uploadToGaiaHub(filename, photoFile, hubConfig)
}

export function uploadProfileToGaiaHub(api: {gaiaHubConfig: GaiaHubConfig},
  identityIndex: number, identityAddress: string, signedProfileTokenData: string) {
  logger.trace('uploadProfileToGaiaHub')
  const hubConfig = api.gaiaHubConfig
  const filename = `${identityIndex}/profile.json`
  return uploadToGaiaHub(filename, signedProfileTokenData, hubConfig, 'application/json')
}

export function redirectToConnectToGaiaHub() {
  logger.trace('redirectToConnectToGaiaHub')
  const port = location.port === '' ? 80 : location.port
  const host = location.hostname
  window.top.location.href = `http://${host}:${port}/account/storage#gaiahub`
}

export { connectToGaiaHub, GaiaHubConfig }

