import * as types from './types'
import { compareProfilesByVerifications } from '../../utils/index'
import log4js from 'log4js'

const logger = log4js.getLogger('store/search/actions.js')

function updateQuery(query) {
  return {
    type: types.UPDATE_QUERY,
    query
  }
}

function updateResults(query, results) {
  return {
    type: types.UPDATE_RESULTS,
    query,
    results
  }
}

function searchIdentities(query, searchUrl, lookupUrl) {
  return dispatch => {
    let url
    let username
    if (/^[a-z0-9_-]+.id+$/.test(query)) {
      username = query.replace('.id', '')
      url = lookupUrl.replace('{name}', username)
    } else {
      url = searchUrl.replace('{query}', query).replace(' ', '%20')
    }
    return fetch(url)
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
            username
          })
        }
        dispatch(updateResults(query, results))
      })
      .catch((error) => {
        logger.warn('searchIdentities: error', error)
      })
  }
}

const SearchActions = {
  searchIdentities,
  updateQuery,
  updateResults
}

export default SearchActions
