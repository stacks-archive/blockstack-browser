import { UPDATE_API } from '../actions/settings'

const initialState = {
  api: {
    nameLookupUrl: 'https://api.onename.com/v1/users/{username}',
    searchUrl: 'https://api.onename.com/v1/search?query={query}',
    registerUrl: 'https://api.onename.com/v1/users',
    addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names'
  },
  bookmarks: [
    {
      label: 'Ryan Shea',
      id: 'ryan.id'
    },
    {
      label: 'Muneeb Ali',
      id: 'muneeb.id'
    },
    {
      label: 'Jude Nelson',
      id: 'judecn.id'
    },
    {
      label: 'Guy Lepage',
      id: 'guylepage3.id'
    },
    {
      label: 'Naval Ravikant',
      id: 'naval.id'
    },
    {
      label: 'Fred Wilson',
      id: 'fredwilson.id'
    }
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
