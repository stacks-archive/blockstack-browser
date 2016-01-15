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
      label: 'Jeff Garzik',
      id: 'jgarzik.id'
    },
    {
      label: 'Fred Wilson',
      id: 'fredwilson.id'
    },
    {
      label: 'Elizabeth Stark',
      id: 'starkness.id'
    },
    {
      label: 'Naval Ravikant',
      id: 'naval.id'
    },
    {
      label: 'Vitalik Buterin',
      id: 'vitalik.id'
    },
    {
      label: 'Albert Wenger',
      id: 'albertwenger.id'
    },
    {
      label: 'Jesse Powell',
      id: 'jespow.id'
    },
    {
      label: 'Sarah Hody',
      id: 'sarah.id'
    },
    {
      label: 'Jeff Huber',
      id: 'jhuber.id'
    },
    {
      label: 'Tiffany Hayden',
      id: 'haydentiff.id'
    },
    {
      label: 'Barry Silbert',
      id: 'barrysilbert.id'
    },
    {
      label: 'Peter Smith',
      id: 'peter.id'
    },
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
