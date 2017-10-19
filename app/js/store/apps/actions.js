import * as types from './types'
import log4js from 'log4js'
import { randomBytes, createHash } from 'crypto'

const logger = log4js.getLogger('store/apps/actions.js')

function updateAppList(apps, version) {
  const lastUpdated = Date.now()
  return {
    type: types.UPDATE_APP_LIST,
    apps,
    version,
    lastUpdated
  }
}

function updateInstanceIdentifier(instanceIdentifier) {
  return {
    type: types.UPDATE_INSTANCE_IDENTIFIER,
    instanceIdentifier
  }
}

function refreshAppList(browserApiUrl, instanceIdentifier) {
  return dispatch => {
    logger.trace('refreshAppList')
    return fetch(`${browserApiUrl}/data?id=${instanceIdentifier}`)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      dispatch(updateAppList(responseJson.apps, responseJson.version))
    })
    .catch((error) => {
      logger.error('refreshAppList:', error)
    })
  }
}

function generateInstanceIdentifier() {
  logger.trace('Generating new instance identifier')
  return dispatch => {
    const instanceIdentifier = createHash('sha256').update(randomBytes(256)).digest('hex')
    dispatch(updateInstanceIdentifier(instanceIdentifier))
  }
}

const AppsActions = {
  updateAppList,
  refreshAppList,
  generateInstanceIdentifier
}

export default AppsActions
