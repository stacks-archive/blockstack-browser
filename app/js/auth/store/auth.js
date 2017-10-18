import { getCoreSession, fetchAppManifest } from 'blockstack'
import log4js from 'log4js'
import { randomBytes, createHash } from 'crypto'

const logger = log4js.getLogger('auth/store/auth.js')

const APP_MANIFEST_LOADING = 'APP_MANIFEST_LOADING'
const APP_MANIFEST_LOADING_ERROR = 'APP_MANIFEST_LOADING_ERROR'
const APP_MANIFEST_LOADED = 'APP_MANIFEST_LOADED'
const APP_META_DATA_LOADED = 'APP_META_DATA_LOADED'
const UPDATE_CORE_SESSION = 'UPDATE_CORE_SESSION'
const LOGGED_IN_TO_APP = 'LOGGED_IN_TO_APP'
const UPDATE_INSTANCE_IDENTIFIER = 'UPDATE_INSTANCE_IDENTIFIER'

function appManifestLoading() {
  return {
    type: APP_MANIFEST_LOADING
  }
}

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

function appMetaDataLoaded(app, appMetaData) {
  return {
    type: APP_META_DATA_LOADED,
    appMetaData
  }
}

function updateInstanceIdentifier(instanceIdentifier) {
  return {
    type: UPDATE_INSTANCE_IDENTIFIER,
    instanceIdentifier
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

function getCoreSessionToken(coreHost, corePort, coreApiPassword,
  appPrivateKey, appDomain, authRequest, blockchainId) {
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

function getAppMetaData(app, address) {
  return dispatch => {
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    const options = {
      method: 'GET',
      headers: requestHeaders
    }
    const params = `app=${encodeURIComponent(app)}&address=${encodeURIComponent(address)}`
    const appMetaDataUrl = `https://blockstack-portal-emailer.appartisan.com/app_meta_data?${params}`
    return fetch(appMetaDataUrl, options)
    .then((response) => {
      response.json().then(data => {
        dispatch(appMetaDataLoaded(app, data))
      })
    }, () => {
    }).catch(error => {
      logger.error('getAppMetaData: error', error)
    })
  }
}


function loadAppManifest(authRequest, ownerAddress) {
  return dispatch => {
    dispatch(appManifestLoading())
    fetchAppManifest(authRequest).then(appManifest => {
      dispatch(appManifestLoaded(appManifest))
      dispatch(getAppMetaData(appManifest.name, ownerAddress))
    }).catch((e) => {
      logger.error('loadAppManifest: error', e)
      dispatch(appManifestLoadingError(e))
    })
  }
}

function generateInstanceIdentifier() {
  logger.trace('Generating new instance identifier')
  return dispatch => {
    let instanceIdentifier = createHash('sha256').update(randomBytes(256)).digest('hex')
    dispatch(updateInstanceIdentifier(instanceIdentifier))
  }
}

const initialState = {
  appManifest: null,
  appManifestLoading: false,
  appManifestLoadingError: null,
  coreSessionTokens: {},
  loggedIntoApp: false,
  instanceIdentifier: null
}

export function AuthReducer(state = initialState, action) {
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
    case APP_META_DATA_LOADED:
      return Object.assign({}, state, {
        appMetaData: action.appMetaData
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
    case UPDATE_INSTANCE_IDENTIFIER:
      return Object.assign({}, state, {
        instanceIdentifier: action.instanceIdentifier
      })
    default:
      return state
  }
}

export const AuthActions = {
  clearSessionToken,
  getCoreSessionToken,
  loadAppManifest,
  getAppMetaData,
  loginToApp,
  generateInstanceIdentifier
}
