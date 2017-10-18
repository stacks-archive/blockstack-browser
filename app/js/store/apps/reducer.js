import * as types from './types'
import appList from '../../data/apps'

const initialState = {
  apps: Object.assign({}, appList)
}

function AppsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_APP_LIST:
      return Object.assign({}, state, {
        apps: action.apps || {}
      })
    default:
      return state
  }
}

export default AppsReducer
