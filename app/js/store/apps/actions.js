import * as types from './types'
import log4js from 'log4js'
import { randomBytes, createHash } from 'crypto'

const API_URL = 'https://app-co-api.herokuapp.com'

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
) => {
  return dispatch => {
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
}

const generateInstanceIdentifier = () => {
  logger.info('Generating new instance identifier')
  return dispatch => {
    const instanceIdentifier = createHash('sha256')
      .update(randomBytes(256))
      .digest('hex')
    dispatch(updateInstanceIdentifier(instanceIdentifier))
  }
}

const fetchAppsList = async () => {}

const fetchAppMiningApps = () => async dispatch => {
  const response = await fetch(`${API_URL}/api/app-mining-apps`)
  const { apps } = await response.json()
  return apps
}

const doFetchApps = () => async (dispatch, getState) => {
  dispatch({
    type: types.FETCH_APPS_STARTED
  })
  try {
    const promises = [
      fetch(`${API_URL}/api/apps`),
      fetch(`${API_URL}/api/app-mining-apps`)
    ]
    const responses = await Promise.all(promises)
    const [allApps, appMiningApps] = await Promise.all([
      responses[0].json(),
      responses[1].json()
    ])

    const blockstackApps = allApps.apps
      .filter(
        app =>
          app.authentication === 'Blockstack' || app.storageNetwork === 'Gaia' // only blockstack apps
      )
      .filter(app => app.category !== 'Sample Blockstack Apps')

    dispatch({
      type: types.FETCH_APPS_FINISHED,
      payload: {
        apps: blockstackApps,
        topApps: appMiningApps.apps
      }
    })
  } catch (e) {
    console.log(e)
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
  fetchAppsList,
  doFetchApps
}

export default AppsActions
