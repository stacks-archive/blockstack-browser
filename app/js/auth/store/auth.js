import {
  getCoreSession,
  verifyAuthRequestAndLoadManifest as bskVerifyAuthRequestAndLoadManifest
} from 'blockstack'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

const APP_MANIFEST_LOADING = 'auth/APP_MANIFEST_LOADING'
const APP_MANIFEST_LOADING_ERROR = 'auth/APP_MANIFEST_LOADING_ERROR'
const APP_MANIFEST_LOADED = 'auth/APP_MANIFEST_LOADED'
const UPDATE_CORE_SESSION = 'auth/UPDATE_CORE_SESSION'
const LOGGED_IN_TO_APP = 'auth/LOGGED_IN_TO_APP'
const STORE_AUTH_REQUEST = 'auth/STORE_AUTH_REQUEST'

function appManifestLoading() {
  return {
    type: APP_MANIFEST_LOADING
  }
}

const storeAuthRequest = authRequest => ({
  type: STORE_AUTH_REQUEST,
  authRequest
})

function appManifestLoadingError(error) {
  return {
    type: APP_MANIFEST_LOADING_ERROR,
    error
  }
}

function appManifestLoaded(appManifest) {
  return {
    type: APP_MANIFEST_LOADED,
    appManifest
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

function getCoreSessionToken(
  coreHost,
  corePort,
  coreApiPassword,
  appPrivateKey,
  appDomain,
  authRequest,
  blockchainId
) {
  return dispatch => {
    logger.info('getCoreSessionToken(): dispatched')
    const deviceId = '0' // Hard code device id until we support multi-device
    getCoreSession(
      coreHost,
      corePort,
      coreApiPassword,
      appPrivateKey,
      blockchainId,
      authRequest,
      deviceId
    ).then(
      coreSessionToken => {
        logger.info('getCoreSessionToken: generated a token!')
        dispatch(updateCoreSessionToken(appDomain, coreSessionToken))
      },
      error => {
        logger.error('getCoreSessionToken: failed:', error)
      }
    )
  }
}

function noCoreSessionToken(appDomain) {
  return dispatch => {
    logger.info('noCoreSessionToken(): dispatched')
    dispatch(updateCoreSessionToken(appDomain, null))
  }
}

function verifyAuthRequestAndLoadManifest(authRequest) {
  return dispatch => {
    dispatch(appManifestLoading())
    bskVerifyAuthRequestAndLoadManifest(authRequest)
      .then(
        appManifest => {
          dispatch(storeAuthRequest(authRequest))
          dispatch(appManifestLoaded(appManifest))
        },
        () => {
          logger.error(
            'verifyAuthRequestAndLoadManifest: invalid authentication request'
          )
          dispatch(appManifestLoadingError('Invalid authentication request.'))
        }
      )
      .catch(e => {
        logger.error('verifyAuthRequestAndLoadManifest: error', e)
        dispatch(appManifestLoadingError(e))
      })
  }
}

export const initialState = {
  appManifest: null,
  appManifestLoaded: false,
  appManifestLoading: false,
  appManifestLoadingError: null,
  coreSessionTokens: {},
  loggedIntoApp: false
}

export function AuthReducer(state = initialState, action) {
  switch (action.type) {
    case APP_MANIFEST_LOADING:
      return {
        ...state,
        appManifest: null,
        appManifestLoading: true,
        appManifestLoadingError: null,
        appManifestLoaded: false
      }
    case APP_MANIFEST_LOADED:
      return {
        ...state,
        appManifest: action.appManifest,
        appManifestLoading: false,
        appManifestLoaded: true
      }
    case APP_MANIFEST_LOADING_ERROR:
      return {
        ...state,
        appManifest: null,
        appManifestLoading: false,
        appManifestLoadingError: action.error
      }
    case UPDATE_CORE_SESSION:
      return {
        ...state,
        coreSessionTokens: {
          ...state.coreSessionTokens,
          [action.appDomain]: action.token
        }
      }
    case STORE_AUTH_REQUEST:
      return {
        ...state,
        authRequest: action.authRequest
      }
    case LOGGED_IN_TO_APP:
      return {
        ...state,
        loggedIntoApp: true
      }
    default:
      return state
  }
}

export const AuthActions = {
  clearSessionToken,
  getCoreSessionToken,
  noCoreSessionToken,
  verifyAuthRequestAndLoadManifest,
  loginToApp
}
