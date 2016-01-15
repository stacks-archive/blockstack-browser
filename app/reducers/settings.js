import { UPDATE_API } from '../actions/settings'

const initialState = {
  api: {
    nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
    searchUrl: 'https://api.onename.com/v1/search?query={query}',
    registerUrl: 'https://api.onename.com/v1/users',
    addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
  },
  bookmarks: [
    { label: 'Naval Ravikant', id: 'naval.id' },
    { label: 'Barry Silbert', id: 'barrysilbert.id' },
    { label: 'Elizabeth Stark', id: 'starkness.id' },
    { label: 'Jeff Garzik', id: 'jgarzik.id' },
    { label: 'Fred Wilson', id: 'fredwilson.id' },
    { label: 'Jesse Powell', id: 'jespow.id' },
    { label: 'Vitalik Buterin', id: 'vitalik.id' },
    { label: 'Sarah Hody', id: 'sarah.id' },
    { label: 'Jeff Huber', id: 'jhuber.id' },
    { label: 'Tiffany Hayden', id: 'haydentiff.id' },
    { label: 'Albert Wenger', id: 'albertwenger.id' },
    { label: 'Peter Smith', id: 'peter.id' },
    { label: 'Ryan Shea', id: 'ryan.id' },
    { label: 'Muneeb Ali', id: 'muneeb.id' },
    { label: 'Jude Nelson', id: 'judecn.id' },
    { label: 'Guy Lepage', id: 'guylepage3.id' }
  ]
}

export default function Settings(state = initialState, action) {
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
