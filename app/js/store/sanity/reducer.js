import * as types from './types'

const initialState = {
  coreApiRunning: false
}

function SanityReducer(state = initialState, action) {
  switch (action.type) {
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
