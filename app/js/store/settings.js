const UPDATE_API = 'UPDATE_API'

function updateApi(api) {
  return {
    type: UPDATE_API,
    api: api
  }
}

function setAPICredentials(api, email, name, company, callback) {
  return dispatch => {
    const signupUrl = "https://api.blockstack.com/signup/browser"
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    const body = JSON.stringify({
      email: email,
      name: name,
      company: company
    })

    fetch(signupUrl, { method: 'POST', headers: headers, mode: 'cors', body: body })
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          callback(false)
        } else {
          api.blockstackApiAppId = responseJson.app_id
          api.blockstackApiAppSecret = responseJson.app_secret

          dispatch(updateApi(api))

          callback(true)
        }
      })
      .catch((error) => {
        console.warn(error)
        callback(false)
      })
  }
}

function resetApi() {
  return dispatch => {
    const DEFAULT_API = {
      apiCustomizationEnabled: true,
      nameLookupUrl: 'http://localhost:8889/v1/names/{name}',
      searchUrl: 'https://api.blockstack.com/v1/search?query={query}',
      registerUrl: 'http://localhost:8889/v1/names',
      addressLookupUrl: 'http://localhost:8889/v1/addresses/{address}',
      priceUrl: 'http://localhost:8889/v1/prices/{name}',
      walletPaymentAddressUrl: 'http://localhost:8889/v1/wallet/payment_address',
      pendingQueuesUrl: 'http://localhost:8889/v1/blockchain/bitcoin/pending',
      hostedDataLocation: 'blockstack-labs-S3',
      blockstackApiAppId:'470c9d0c7dbd41b1bb6defac9be3595a',
      blockstackApiAppSecret: 'c1e21c522cbd59c78b05294604f8bb88fc06fd7b1d7c3308e91f4f1124487117',
      s3ApiKey: '',
      s3ApiSecret: '',
      s3Bucket: ''
    }
    dispatch(updateApi(DEFAULT_API))
  }
}

export const SettingsActions = {
  updateApi: updateApi,
  resetApi: resetApi,
  setAPICredentials: setAPICredentials
}

const initialState = {
  api: {
    apiCustomizationEnabled: true,
    nameLookupUrl: 'http://localhost:8889/v1/names/{name}',
    searchUrl: 'https://api.blockstack.com/v1/search?query={query}',
    registerUrl: 'http://localhost:8889/v1/names',
    addressLookupUrl: 'http://localhost:8889/v1/addresses/{address}',
    priceUrl: 'http://localhost:8889/v1/prices/{name}',
    walletPaymentAddressUrl: 'http://localhost:8889/v1/wallet/payment_address',
    pendingQueuesUrl: 'http://localhost:8889/v1/blockchain/bitcoin/pending',
    hostedDataLocation: 'blockstack-labs-S3',
    blockstackApiAppId:'470c9d0c7dbd41b1bb6defac9be3595a',
    blockstackApiAppSecret: 'c1e21c522cbd59c78b05294604f8bb88fc06fd7b1d7c3308e91f4f1124487117',
    s3ApiKey: '',
    s3ApiSecret: '',
    s3Bucket: ''
  }
}

export function SettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_API:
      return Object.assign({}, state, {
        api: action.api || {}
      })
    default:
      return state
  }
}
