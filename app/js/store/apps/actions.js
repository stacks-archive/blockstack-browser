import * as types from './types'
import log4js from 'log4js'

const logger = log4js.getLogger('store/apps/actions.js')

function updateAppList(apps, version) {
  return {
    type: types.UPDATE_APP_LIST,
    apps,
    version
  }
}

function refreshAppList() {
  return dispatch => {
    logger.trace('refreshAppList')
    return fetch('http://localhost:2888/data').then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      console.log('responseJson')
      console.log(responseJson)
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
