import { fetchAppManifest } from 'blockstack'

const APP_MANIFEST_LOADING = 'APP_MANIFEST_LOADING',
      APP_MANIFEST_LOADING_ERROR = 'APP_MANIFEST_LOADING_ERROR',
      APP_MANIFEST_LOADED = 'APP_MANIFEST_LOADED'

export const AuthActions = {
  resetAuthRequest: resetAuthRequest,
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
  appManifestLoadingError: null
}

export function AuthReducer(state=initialState, action) {
  switch (action.type) {
    case APP_MANIFEST_LOADING:
      return Object.assign({}, state, {
        appManifest: null,
        appManifestLoading: true,
        appManifestLoadingError: null
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
    default:
      return state
  }
}
