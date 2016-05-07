const UPDATE_API = 'UPDATE_API'

function updateApi(api) {
  return {
    type: UPDATE_API,
    api: api
  }
}

function resetApi() {
  return dispatch => {
    const DEFAULT_API = {
      nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
      searchUrl: 'https://api.onename.com/v1/search?query={query}',
      registerUrl: 'https://api.onename.com/v1/users',
      addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names',
      s3ApiKey: 'AKIAICPHOLRQJ23JBVAQ',
      s3ApiSecret: '',
      s3Bucket: 'zf9'
    }
    dispatch(updateApi(DEFAULT_API))
  }
}

export const SettingsActions = {
  updateApi: updateApi,
  resetApi: resetApi
}

const initialState = {
  api: {
    nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
    searchUrl: 'https://api.onename.com/v1/search?query={query}',
    registerUrl: 'https://api.onename.com/v1/users',
    addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names',
    s3ApiKey: 'AKIAICPHOLRQJ23JBVAQ',
    s3ApiSecret: '',
    s3Bucket: 'zf9'
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
