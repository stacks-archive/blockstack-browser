import DEFAULT_API from './default'
import * as types from './types'
import log4js from 'log4js'
import { selectApi } from '@common/store/selectors/settings'
import { selectIdentityKeypairs } from '@common/store/selectors/account'
import { selectLocalIdentities } from '@common/store/selectors/profiles'
import { connectToGaiaHub } from '../../utils/blockstack-inc'
import { BLOCKSTACK_INC, resolveGaiaHubConfigForAddress } from '../../utils'
import { setCoreStorageConfig } from '@utils/api-utils'
import AccountActions from '../account/actions'

const logger = log4js.getLogger(__filename)

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
  return dispatch => (
    fetch(btcPriceUrl)
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        dispatch(updateBtcPrice(responseJson.last))
      })
      .catch(error => {
        logger.error('refreshBtcPrice:', error)
      })
  )
}

function resetApi(api) {
  logger.info('resetApi')
  let coreAPIPassword = api.coreAPIPassword
  let gaiaHubConfig = api.gaiaHubConfig

  if (gaiaHubConfig === undefined) {
    gaiaHubConfig = null
  }

  if (coreAPIPassword === undefined) {
    coreAPIPassword = DEFAULT_API.coreAPIPassword
  }
  return dispatch => {
    dispatch(
      updateApi(
        Object.assign({}, DEFAULT_API, {
          gaiaHubConfig,
          coreAPIPassword
        })
      )
    )
  }
}

function connectStorage(customGaiaUrl) {
  return async (dispatch, getState) => {
    logger.info('connectStorage')
    const state = getState()
    const api = selectApi(state)
    const idKeypairs = selectIdentityKeypairs(state)
    const localIdentities = selectLocalIdentities(state)

    let identityIndex = 0
    try {
      identityIndex = state.profiles.identity.default
    } catch (error) {
      logger.error(`connectStorage: error finding default account index: ${error}`)
    }

    if (!idKeypairs || !idKeypairs[identityIndex] || !idKeypairs[identityIndex].key) {
      const errMsg = 'connectStorage: no keypairs, bailing out'
      logger.error(errMsg)
      throw new Error(errMsg)
    }
    const identityKeypair = idKeypairs[identityIndex]

    let gaiaHubConfig
    let gaiaHubUrl

    if (customGaiaUrl) {
      try {
        gaiaHubConfig = await connectToGaiaHub(customGaiaUrl, identityKeypair.key)
        gaiaHubUrl = gaiaHubConfig.server
      } catch (error) {
        logger.error(`connectStorage: error connectToGaiaHub with customGaiaUrl ${customGaiaUrl}: ${error}`)
        throw error
      }
    } else {
      try {
        gaiaHubConfig = await resolveGaiaHubConfigForAddress(
          identityKeypair.address, 
          identityKeypair.key, 
          api.bitcoinAddressLookupUrl, 
          api.nameLookupUrl,
          localIdentities)
        gaiaHubUrl = gaiaHubConfig.server
      } catch (error) {
        logger.error(`connectStorage: error resolveGaiaHubConfigForAddress: ${error}`)
        throw error
      }
    }

    logger.debug(`connectStorage: using gaia hub url: ${gaiaHubUrl}`)

    const newApi = Object.assign({}, api, {
      gaiaHubConfig,
      gaiaHubUrl,
      hostedDataLocation: BLOCKSTACK_INC
    })
    dispatch(updateApi(newApi))

    const identity = localIdentities[identityIndex]
    const identityAddress = identity.ownerAddress
    const profileSigningKeypair = idKeypairs[identityIndex]
    const profile = identity.profile
    setCoreStorageConfig(
      newApi,
      identityIndex,
      identityAddress,
      profile,
      profileSigningKeypair,
      identity
    )
    logger.debug('connectStorage: storage initialized')

    const newApi2 = Object.assign({}, newApi, { storageConnected: true })
    dispatch(updateApi(newApi2))
    dispatch(AccountActions.storageIsConnected())
    logger.debug('connectStorage: storage configured')
  }
}

const SettingsActions = {
  refreshBtcPrice,
  resetApi,
  updateApi,
  updateBtcPrice,
  connectStorage
}

export default SettingsActions
