// @flow
import log4js from 'log4js'
import { connectToGaiaHub as bsConnectToGaiaHub, GaiaHubConfig, uploadToGaiaHub } from 'blockstack'

const logger = log4js.getLogger(__filename)

export function redirectToConnectToGaiaHub() {
  logger.info('redirectToConnectToGaiaHub')
  const port = location.port === '' ? 80 : location.port
  const host = location.hostname
  window.top.location.href = `http://${host}:${port}/account/storage#gaiahub`
}

// TODO: break here to see resulting hubUrl calls
const connectToGaiaHub = (hubUrl: string, key: string, associationToken?: string) => 
  bsConnectToGaiaHub(hubUrl, key, associationToken)

export { connectToGaiaHub, GaiaHubConfig, uploadToGaiaHub }
