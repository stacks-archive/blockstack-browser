import {
  UPDATE_APP_LIST,
  UPDATE_INSTANCE_IDENTIFIER,
  FETCH_APPS_ERROR,
  FETCH_APPS_FINISHED,
  FETCH_APPS_STARTED
} from './types'

import appList from '../../data/apps'

const initialState = {
  apps: [],
  topApps: [],
  appsByCategory: [],
  error: null,
  loading: false,
  version: appList.version,
  lastUpdated: 0,
  instanceIdentifier: null,
  instanceCreationDate: null
}

const AppsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_APPS_STARTED:
      return {
        ...state,
        loading: true,
        error: null
      }
    case FETCH_APPS_ERROR:
      return {
        ...state,
        loading: false,
        error: payload
      }
    case FETCH_APPS_FINISHED:
      return {
        ...state,
        apps: payload.apps || [],
        topApps: payload.topApps || [],
        appsByCategory: payload.appsByCategory || [],
        loading: false,
        error: null,
        lastUpdated: Date.now()
      }
    case UPDATE_APP_LIST:
      return {
        ...state,
        apps: payload.apps || [],
        version: payload.version,
        lastUpdated: payload.lastUpdated
      }
    case UPDATE_INSTANCE_IDENTIFIER:
      return {
        ...state,
        instanceIdentifier: payload.instanceIdentifier,
        instanceCreationDate: payload.instanceCreationDate
      }
    default:
      return state
  }
}

export default AppsReducer
