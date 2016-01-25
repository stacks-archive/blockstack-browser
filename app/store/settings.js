const UPDATE_API = 'UPDATE_API'

function updateApi(nameLookupUrl, searchUrl, registerUrl, addressLookupUrl) {
  return {
    type: UPDATE_API,
    nameLookupUrl: nameLookupUrl,
    searchUrl: searchUrl,
    registerUrl: registerUrl,
    addressLookupUrl: addressLookupUrl
  }
}

function resetApi() {
  return dispatch => {
    const DEFAULT_API = {
      nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
      searchUrl: 'https://api.onename.com/v1/search?query={query}',
      registerUrl: 'https://api.onename.com/v1/users',
      addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
    }
    dispatch(updateApi(
      DEFAULT_API.nameLookupUrl,
      DEFAULT_API.searchUrl,
      DEFAULT_API.registerUrl,
      DEFAULT_API.addressLookupUrl
    ))
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
    addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
  },
  bookmarks: [
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/starkness'}], name: 'Elizabeth Stark'}, id: 'starkness.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jgarzik'}], name: 'Jeff Garzik'}, id: 'jgarzik.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jespow'}], name: 'Jesse Powell'}, id: 'jespow.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/vitalik'}], name: 'Vitalik Buterin'}, id: 'vitalik.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/sarah'}], name: 'Sarah Hody'}, id: 'sarah.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jhuber'}], name: 'Jeff Huber'}, id: 'jhuber.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/haydentiff'}], name: 'Tiffany Hayden'}, id: 'haydentiff.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/65m/avatar-placeholder.png'}], name: 'Naval Ravikant'}, id: 'naval.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/65m/avatar-placeholder.png'}], name: 'Barry Silbert'}, id: 'barrysilbert.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/65m/avatar-placeholder.png'}], name: 'Fred Wilson'}, id: 'fredwilson.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/65m/avatar-placeholder.png'}], name: 'Albert Wenger'}, id: 'albertwenger.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/peter'}], name: 'Peter Smith'}, id: 'peter.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/ryan'}], name: 'Ryan Shea'}, id: 'ryan.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/muneeb'}], name: 'Muneeb Ali'}, id: 'muneeb.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/judecn'}], name: 'Jude Nelson'}, id: 'judecn.id' },
    { profile: {'@type': 'Person', image: [{'@type': 'ImageObject', name: 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/guylepage3'}], name: 'Guy Lepage'}, id: 'guylepage3.id' }
  ]
}

export function SettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_API:
      return Object.assign({}, state, {
        api: {
          nameLookupUrl: action.nameLookupUrl,
          searchUrl: action.searchUrl,
          registerUrl: action.registerUrl,
          addressLookupUrl: action.addressLookupUrl
        }
      })
    default:
      return state
  }
}
