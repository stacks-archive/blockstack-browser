import { getCoreSession, fetchAppManifest } from 'blockstack'
import log4js from 'log4js'

const logger = log4js.getLogger('auth/store/auth.js')

const APP_MANIFEST_LOADING = 'APP_MANIFEST_LOADING'
const APP_MANIFEST_LOADING_ERROR = 'APP_MANIFEST_LOADING_ERROR'
const APP_MANIFEST_LOADED = 'APP_MANIFEST_LOADED'
const UPDATE_CORE_SESSION = 'UPDATE_CORE_SESSION'
const LOGGED_IN_TO_APP = 'LOGGED_IN_TO_APP'

export const AuthActions = {
  clearSessionToken,
  getCoreSessionToken,
  loadAppManifest,
  loginToApp
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

function updateCoreSessionToken(appDomain, token) {
  return {
    type: UPDATE_CORE_SESSION,
    appDomain,
    token
  }
}

function loggedIntoApp() {
  return {
    type: LOGGED_IN_TO_APP
  }
}

function clearSessionToken(appDomain) {
  return dispatch => {
    dispatch(updateCoreSessionToken(appDomain, null))
  }
}

function loginToApp() {
  return dispatch => {
    dispatch(loggedIntoApp())
  }
}

function getCoreSessionToken(coreHost, corePort, coreApiPassword, appPrivateKey, appDomain, authRequest, blockchainId) {
  return dispatch => {
    logger.trace('getCoreSessionToken(): dispatched')
    const deviceId = '0' // Hard code device id until we support multi-device
    getCoreSession(coreHost, corePort, coreApiPassword, appPrivateKey, blockchainId,
      authRequest, deviceId)
        .then((coreSessionToken) => {
          logger.trace('getCoreSessionToken: generated a token!')
          dispatch(updateCoreSessionToken(appDomain, coreSessionToken))
        }, (error) => {
          logger.error('getCoreSessionToken: failed:', error)
        })
  }
}

function loadAppManifest(authRequest) {
  return dispatch => {
    dispatch(appManifestLoading())
    fetchAppManifest(authRequest).then(appManifest => {
      dispatch(appManifestLoaded(appManifest))
    }).catch((e) => {
      logger.error('loadAppManifest: error', e)
      dispatch(appManifestLoadingError(e))
    })
  }
}

const initialState = {
  appManifest: null,
  appManifestLoading: false,
  appManifestLoadingError: null,
  coreSessionTokens: {},
  loggedIntoApp: false
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
    case UPDATE_CORE_SESSION:
      return Object.assign({}, state, {
        coreSessionTokens: Object.assign({}, state.coreSessionTokens, {
          [action.appDomain]: action.token
        })
      })
    case LOGGED_IN_TO_APP:
      return Object.assign({}, state, {
        loggedIntoApp: true
      })
    default:
      return state
  }
}
