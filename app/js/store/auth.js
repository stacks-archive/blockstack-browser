import { fetchAppManifest } from 'blockstack'

const APP_MANIFEST_LOADING = 'APP_MANIFEST_LOADING',
      APP_MANIFEST_LOADING_ERROR = 'APP_MANIFEST_LOADING_ERROR',
      APP_MANIFEST_LOADED = 'APP_MANIFEST_LOADED',
      REQUEST_APPROVED = 'REQUEST_APPROVED',
      REQUEST_DENIED = 'REQUEST_DENIED'

export const AuthActions = {
  resetAuthRequest: resetAuthRequest,
  approveRequest: approveRequest,
  denyRequest: denyRequest,
  loadAppManifest: loadAppManifest
}

function appManifestLoading() {
  return {
    type: APP_MANIFEST_LOADING
  }
}

function appManifestLoadingError(error) {
  return {
    type: APP_MANIFEST_LOADING_ERROR,
    error: error
  }
}

function appManifestLoaded(appManifest) {
  return {
    type: APP_MANIFEST_LOADED,
    appManifest: appManifest
  }
}

function requestApproved() {
  return {
    type: REQUEST_APPROVED
  }
}

function requestDenied() {
  return {
    type: REQUEST_DENIED
  }
}

function resetAuthRequest() {
  return dispatch => {
    dispatch(resetAuth())
  }
}

function approveRequest(authRequest) {
  return dispatch => {
    // TODO implement
  }
}

function denyRequest(authRequest) {
  return dispatch => {
    // TODO implement
  }
}

function loadAppManifest(authRequest) {
  return dispatch => {
    dispatch(appManifestLoading())
    fetchAppManifest(authRequest).then(appManifest => {
      dispatch(appManifestLoaded(appManifest))
    }).catch((e) => {
      console.error(e)
      dispatch(appManifestLoadingError(e))
    })
  }
}

const initialState = {
  appManifest: null,
  appManifestLoading: false,
  appManifestLoadingError: null,
  requestApproved: false,
  requestReviewed: false
}

export function AuthReducer(state=initialState, action) {
  switch (action.type) {
    case APP_MANIFEST_LOADING:
      return Object.assign({}, state, {
        appManifest: null,
        appManifestLoading: true,
        appManifestLoadingError: null,
        requestApproved: false,
        requestReviewed: false
      })
    case APP_MANIFEST_LOADED:
      return Object.assign({}, state, {
        appManifest: action.appManifest,
        appManifestLoading: false
      })
    case APP_MANIFEST_LOADING_ERROR:
      return Object.assign({}, state, {
        appManifest: null,
        appManifestLoading: false,
        appManifestLoadingError: action.error
      })
    case REQUEST_APPROVED:
      return Object.assign({}, state, {
        requestApproved: true,
        requestReviewed: false
      })
    case REQUEST_DENIED:
      return Object.assign({}, state, {
        requestApproved: false,
        requestReviewed: true
      })
    default:
      return state
  }
}
