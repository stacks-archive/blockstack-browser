import * as types from './types'

const initialState = {
  publicKeys: {}
}

function PGPReducer(state = initialState, action) {
  switch (action.type) {
    case types.LOADING_PGP_KEY:
      return Object.assign({}, state, {
        publicKeys: Object.assign({}, state.publicKeys, {
          [action.identifier]: {
            loading: true,
            key: null,
            error: null
          }
        })
      })
    case types.LOADED_PGP_KEY:
      return Object.assign({}, state, {
        publicKeys: Object.assign({}, state.publicKeys, {
          [action.identifier]: {
            loading: false,
            key: action.key,
            error: null
          }
        })
      })
    case types.LOADING_PGP_KEY_ERROR:
      return Object.assign({}, state, {
        publicKeys: Object.assign({}, state.publicKeys, {
          [action.identifier]: {
            loading: false,
            key: null,
            error: action.error
          }
        })
      })
    default:
      return state
  }
}

export default PGPReducer
