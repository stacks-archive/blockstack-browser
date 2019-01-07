// @flow
import log4js from 'log4js'
import { connectToGaiaHub as bsConnectToGaiaHub, GaiaHubConfig, uploadToGaiaHub } from 'blockstack'
import packageJSON from '../../../../package.json'

const logger = log4js.getLogger(__filename)

export function redirectToConnectToGaiaHub() {
  logger.info('redirectToConnectToGaiaHub')
  const port = location.port === '' ? 80 : location.port
  const host = location.hostname
  window.top.location.href = `http://${host}:${port}/account/storage#gaiahub`
}

const connectToGaiaHub = (hubUrl: string, key: string) => bsConnectToGaiaHub(hubUrl, key, undefined, { browserVersion: packageJSON.version })

export { connectToGaiaHub, GaiaHubConfig, uploadToGaiaHub }
