import DEFAULT_API from './default'
import * as types from './types'
import log4js from 'log4js'

const logger = log4js.getLogger('account/store/settings/actions.js')

function updateApi(api) {
  return {
    type: types.UPDATE_API,
    api
  }
}

function updateBtcPrice(price) {
  return {
    type: types.UPDATE_BTC_PRICE,
    price
  }
}

function refreshBtcPrice(btcPriceUrl) {
  return dispatch => {
    return fetch(btcPriceUrl).then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      dispatch(updateBtcPrice(responseJson.last))
    })
    .catch((error) => {
      logger.error('refreshBtcPrice:', error)
    })
  }
}

function resetApi(api) {
  logger.trace('resetApi')
  let coreAPIPassword = api.coreAPIPassword
  let gaiaHubConfig = api.gaiaHubConfig

  if (gaiaHubConfig === undefined) {
    gaiaHubConfig = null
  }

  if (coreAPIPassword === undefined) {
    coreAPIPassword = null
  }
  return dispatch => {
    dispatch(updateApi(Object.assign({}, DEFAULT_API, {
      gaiaHubConfig,
      coreAPIPassword
    })))
  }
}

const SettingsActions = {
  refreshBtcPrice,
  resetApi,
  updateApi,
  updateBtcPrice
}

export default SettingsActions
