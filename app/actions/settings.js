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
