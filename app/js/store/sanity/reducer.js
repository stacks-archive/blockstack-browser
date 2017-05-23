import * as types from './types'

const initialState = {
  coreApiRunning: false,
  coreApiPasswordValid: false
}

function SanityReducer(state = initialState, action) {
  switch (action.type) {
    case types.CORE_API_PASSWORD_NOT_VALID:
      return Object.assign({}, state, {
        coreApiPasswordValid: false
      })
    case types.CORE_API_PASSWORD_VALID:
      return Object.assign({}, state, {
        coreApiPasswordValid: true
      })
    case types.CORE_IS_NOT_RUNNING:
      return Object.assign({}, state, {
        coreApiRunning: false
      })
    case types.CORE_IS_RUNNING:
      return Object.assign({}, state, {
        coreApiRunning: true
      })
    default:
      return state
  }
}

export default SanityReducer
