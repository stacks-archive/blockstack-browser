import * as types from './types'

const initialState = {
  query: '',
  results: []
}

function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_QUERY:
      return Object.assign({}, state, {
        query: action.query
      })
    case types.UPDATE_RESULTS:
      return Object.assign({}, state, {
        query: action.query,
        results: action.results
      })
    default:
      return state
  }
}

export default SearchReducer
