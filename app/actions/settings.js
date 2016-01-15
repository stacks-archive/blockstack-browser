export const UPDATE_API = 'UPDATE_API'

export function updateApi(nameLookupUrl, searchUrl, registerUrl, addressLookupUrl) {
  return {
    type: UPDATE_API,
    nameLookupUrl: nameLookupUrl,
    searchUrl: searchUrl,
    registerUrl: registerUrl,
    addressLookupUrl: addressLookupUrl
  }
}

export function resetApi() {
  return dispatch => {
    const DEFAULT_API = {
      nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
      searchUrl: 'https://api.onename.com/v1/search?query={query}',
      registerUrl: 'https://api.onename.com/v1/users',
      addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
    }
    dispatch(updateApi(DEFAULT_API.nameLookupUrl, DEFAULT_API.searchUrl, DEFAULT_API.registerUrl, DEFAULT_API.addressLookupUrl))
  }
}