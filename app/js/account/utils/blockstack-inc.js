// @flow
import log4js from 'log4js'
import { connectToGaiaHub, GaiaHubConfig } from 'blockstack'

const logger = log4js.getLogger(__filename)

export function redirectToConnectToGaiaHub() {
  logger.trace('redirectToConnectToGaiaHub')
  const port = location.port === '' ? 80 : location.port
  const host = location.hostname
  window.top.location.href = `http://${host}:${port}/account/storage#gaiahub`
}

export { connectToGaiaHub, GaiaHubConfig }
