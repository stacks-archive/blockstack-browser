import { getNumberOfVerifications, compareProfilesByVerifications } from '../utils/index'
import log4js from 'log4js'

const logger = log4js.getLogger('store/search.js')

const UPDATE_QUERY = 'UPDATE_QUERY'
const UPDATE_RESULTS = 'UPDATE_RESULTS'

function updateQuery(query) {
  return {
    type: UPDATE_QUERY,
    query: query
  }
}

function updateResults(query, results) {
  return {
    type: UPDATE_RESULTS,
    query: query,
    results: results
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
          results.sort(compareProfilesByVerifications)
        } else {
          results.push({
            profile: responseJson[username].profile,
            username: username
          })
        }
        dispatch(updateResults(query, results))
      })
      .catch((error) => {
        logger.warn('searchIdentities: error', error)
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
  results: []
}

export function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_QUERY:
      return Object.assign({}, state, {
        query: action.query
      })
    case UPDATE_RESULTS:
      return Object.assign({}, state, {
        query: action.query,
        results: action.results
      })
    default:
      return state
  }
}
