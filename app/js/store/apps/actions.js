import * as types from './types'
import log4js from 'log4js'
import * as crypto from 'crypto'

const API_URL = 'https://api.app.co'

const logger = log4js.getLogger(__filename)

const updateAppList = (apps, version) => {
  const lastUpdated = Date.now()
  return {
    type: types.UPDATE_APP_LIST,
    payload: {
      apps,
      version,
      lastUpdated
    }
  }
}

const updateInstanceIdentifier = instanceIdentifier => {
  const instanceCreationDate = Date.now()
  return {
    type: types.UPDATE_INSTANCE_IDENTIFIER,
    payload: {
      instanceIdentifier,
      instanceCreationDate
    }
  }
}

const refreshAppList = (
  browserApiUrl,
  instanceIdentifier,
  instanceCreationDate
) => dispatch => {
    logger.info('refreshAppList')
    if (instanceIdentifier) {
      return fetch(
        `${browserApiUrl}/data?id=${instanceIdentifier}&created=${instanceCreationDate}`
      )
        .then(response => response.text())
        .then(responseText => JSON.parse(responseText))
        .then(responseJson => {
          dispatch(updateAppList(responseJson.apps, responseJson.version))
        })
        .catch(error => {
          logger.error('refreshAppList:', error)
        })
    } else {
      return null
    }
  }

const generateInstanceIdentifier = () => {
  logger.info('Generating new instance identifier')
  return dispatch => {
    const instanceIdentifier = crypto.createHash('sha256')
      .update(crypto.randomBytes(256))
      .digest('hex')
    dispatch(updateInstanceIdentifier(instanceIdentifier))
  }
}

const doFetchApps = () => async dispatch => {
  dispatch({
    type: types.FETCH_APPS_STARTED
  })
  try {
    const res = await fetch(`${API_URL}/api/app-mining-apps`)

    const allBlockstackApps = await res.json()

    const apps = allBlockstackApps.apps.filter(
      app => app.category !== 'Sample Blockstack Apps'
    )

    const categories = [...new Set(apps.map(app => app.category))]

    const appsByCategory = categories.map(category => ({
      label: category,
      apps: apps.filter(app => app.category === category)
    }))

    const topApps = allBlockstackApps.apps.filter(app => app.miningReady)

    dispatch({
      type: types.FETCH_APPS_FINISHED,
      payload: {
        apps,
        topApps,
        appsByCategory
      }
    })
  } catch (e) {
    dispatch({
      type: types.FETCH_APPS_ERROR,
      payload: {
        error: e.msg
      }
    })
  }
}

const AppsActions = {
  updateAppList,
  refreshAppList,
  generateInstanceIdentifier,
  doFetchApps
}

export default AppsActions
