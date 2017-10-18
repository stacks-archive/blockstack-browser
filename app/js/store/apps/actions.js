import * as types from './types'
import log4js from 'log4js'

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

function refreshAppList(browserApiUrl) {
  return dispatch => {
    logger.trace('refreshAppList')
    return fetch(`${browserApiUrl}/data`).then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      dispatch(updateAppList(responseJson.apps, responseJson.version))
    })
    .catch((error) => {
      logger.error('refreshAppList:', error)
    })
  }
}

const AppsActions = {
  updateAppList,
  refreshAppList
}

export default AppsActions
