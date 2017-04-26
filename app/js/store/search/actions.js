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
  logger.trace(`searchIdentities: query: "${query}" searchUrl: ${searchUrl} ${lookupUrl}`)
  return dispatch => {
    let url
    let username
    if (/^[a-z0-9_-]+.id+$/.test(query)) {
      logger.debug(`searchIdentities:
        "${query}": looks like a '.id' Blockstack ID. Let's look it up...`)
      username = query.replace('.id', '')
      url = lookupUrl.replace('{name}', username)
    } else {
      logger.debug(`"${query}": isn't a '.id' Blockstack ID. Let's search...`)
      url = searchUrl.replace('{query}', query).replace(' ', '%20')
    }
    return fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        let results = []
        if (responseJson.hasOwnProperty('results')) {
          logger.debug(`"${query}" produced multiple results. Sorting by verification level...`)
          results = responseJson.results
          results.sort(compareProfilesByVerifications)
        } else {
          logger.debug(`Found an exact match for "${query}"`)
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
