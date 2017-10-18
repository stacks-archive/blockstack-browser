import * as types from './types'
import appList from '../../data/apps'

const initialState = {
  apps: [],
  version: appList.version,
  lastUpdated: 0
}

function AppsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_APP_LIST:
      return Object.assign({}, state, {
        apps: action.apps || [],
        version: action.version,
        lastUpdated: action.lastUpdated
      })
    default:
      return state
  }
}

export default AppsReducer
