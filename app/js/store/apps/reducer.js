import * as types from './types'
import appList from '../../data/apps'

const initialState = {
  apps: [],
  version: appList.version,
  lastUpdated: 0,
  instanceIdentifier: null,
  instanceCreationDate: null
}

function AppsReducer(state = initialState, action) {
  switch (action.type) {
    case types.UPDATE_APP_LIST:
      return Object.assign({}, state, {
        apps: action.apps || [],
        version: action.version,
        lastUpdated: action.lastUpdated
      })
    case types.UPDATE_INSTANCE_IDENTIFIER:
      return Object.assign({}, state, {
        instanceIdentifier: action.instanceIdentifier,
        instanceCreationDate: action.instanceCreationDate
      })
    default:
      return state
  }
}

export default AppsReducer
