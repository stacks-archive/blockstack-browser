import { DROPBOX } from '../storage/utils/index'
import log4js from 'log4js'

const logger = log4js.getLogger('store/settings.js')

const UPDATE_API = 'UPDATE_API'
const UPDATE_BTC_PRICE = 'UPDATE_BTC_PRICE'


// DEFAULT_API values are only used if
// the user's settings.api state doesn't
// already have an existing key.
// To change a value, use a new key.
export const DEFAULT_API = {
  apiCustomizationEnabled: true,
  nameLookupUrl: 'http://localhost:6270/v1/names/{name}',
  searchUrl: 'https://api.blockstack.com/v1/search?query={query}',
  registerUrl: 'http://localhost:6270/v1/names',
  addressLookupUrl: 'http://localhost:6270/v1/addresses/{address}',
  addressBalanceUrl: 'https://explorer.blockstack.org/insight-api/addr/{address}/?noTxList=1',
  utxoUrl: 'https://explorer.blockstack.org/insight-api/addr/{address}/utxo',
  broadcastTransactionUrl: 'https://explorer.blockstack.org/insight-api/tx/send',
  priceUrl: 'http://localhost:6270/v1/prices/names/{name}',
  networkFeeUrl: 'https://bitcoinfees.21.co/api/v1/fees/recommended',
  walletPaymentAddressUrl: 'http://localhost:6270/v1/wallet/payment_address',
  pendingQueuesUrl: 'http://localhost:6270/v1/blockchains/bitcoin/pending',
  coreWalletWithdrawUrl: 'http://localhost:6270/v1/wallet/balance',
  bitcoinAddressUrl: 'https://explorer.blockstack.org/address/{identifier}',
  ethereumAddressUrl: 'https://tradeblock.com/ethereum/account/{identifier}',
  pgpKeyUrl: 'https://pgp.mit.edu/pks/lookup?search={identifier}&op=vindex&fingerprint=on',
  btcPriceUrl: 'https://www.bitstamp.net/api/v2/ticker/btcusd/',
  hostedDataLocation: DROPBOX,
  coreAPIPassword: null,
  logServerPort: '',
  s3ApiKey: '',
  s3ApiSecret: '',
  s3Bucket: '',
  dropboxAccessToken: null,
  btcPrice: '1000.00'
}

function updateApi(api) {
  return {
    type: UPDATE_API,
    api
  }
}

function updateBtcPrice(price) {
  return {
    type: UPDATE_BTC_PRICE,
    price
  }
}

function resetApi(api) {
  logger.trace('resetApi')
  return dispatch => {
    dispatch(updateApi(Object.assign({}, DEFAULT_API, {
      dropboxAccessToken: api.dropboxAccessToken,
      coreAPIPassword: api.coreAPIPassword
    })))
  }
}

function refreshBtcPrice(btcPriceUrl) {
  return dispatch => {
    fetch(btcPriceUrl).then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      dispatch(updateBtcPrice(responseJson.last))
    })
    .catch((error) => {
      logger.error('refreshBtcPrice:', error)
    })
  }
}

function addMissingApiKeys(newState) {
  Object.keys(DEFAULT_API).forEach((key) => {
    if (newState.api[key] === undefined) {
      newState.api[key] = DEFAULT_API[key]
    }
  })
  return newState
}

export const SettingsActions = {
  updateApi,
  resetApi,
  refreshBtcPrice
}

const initialState = {
  api: Object.assign({}, DEFAULT_API)
}

export function SettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_API:
      return Object.assign({}, state, {
        api: action.api || {}
      })
    case UPDATE_BTC_PRICE:
      return Object.assign({}, state, {
        api: Object.assign({}, state.api, {
          btcPrice: action.price
        })
      })
    default: {
      let newState = Object.assign({}, state, {
        api: state.api
      })
      newState = addMissingApiKeys(newState)
      return newState
    }
  }
}
