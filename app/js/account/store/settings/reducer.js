import DEFAULT_API from './default'
import * as types from './types'

const initialState = {
  api: Object.assign({}, DEFAULT_API)
}

function addMissingApiKeys(newState) {
  Object.keys(DEFAULT_API).forEach(key => {
    if (newState.api[key] === undefined) {
      newState.api[key] = DEFAULT_API[key]
    }
  })
  return newState
}

function SettingsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_API:
      return Object.assign({}, state, {
        api: action.api || {}
      })
    case types.UPDATE_BTC_PRICE:
      return Object.assign({}, state, {
        api: Object.assign({}, state.api, {
          btcPrice: action.price
        })
      })
    default: {
      let newState = Object.assign({}, state, {
        api: state.api
      })
      newState = addMissingApiKeys(newState)
      return newState
    }
  }
}

export default SettingsReducer
