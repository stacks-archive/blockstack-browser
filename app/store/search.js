const UPDATE_QUERY = 'UPDATE_QUERY'
const UPDATE_RESULTS = 'UPDATE_RESULTS'

function updateQuery(query) {
  return {
    type: UPDATE_QUERY,
    query: query,
    searchInProgress: true
  }
}

function updateResults(query, results) {
  return {
    type: UPDATE_RESULTS,
    query: query,
    results: results,
    searchInProgress: false
  }
}

function searchIdentities(query, searchUrl, lookupUrl) {
  return dispatch => {
    let url, username
    if (/^[a-z0-9_-]+.id+$/.test(query)) {
      username = query.replace('.id', '')
      url = lookupUrl.replace('{name}', username)
    } else {
      url = searchUrl.replace('{query}', query).replace(' ', '%20')
    }
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        let results = []
        if (responseJson.hasOwnProperty('results')) {
          results = responseJson.results
        } else {
          results.push({
            profile: responseJson[username].profile,
            username: username
          })
        }

        dispatch(updateResults(query, results))
      })
      .catch((error) => {
        console.warn(error)
      })
  }
}

export const SearchActions = {
  updateQuery: updateQuery,
  updateResults: updateResults,
  searchIdentities: searchIdentities
}

const initialState = {
  query: '',
  results: [],
  searchInProgress: false
}

export function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_QUERY:
      return Object.assign({}, state, {
        query: action.query,
        searchInProgress: action.searchInProgress
      })
    case UPDATE_RESULTS:
      return Object.assign({}, state, {
        query: action.query,
        results: action.results,
        searchInProgress: action.searchInProgress
      })
    default:
      return state
  }
}