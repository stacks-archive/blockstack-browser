import {
  makeProfileZoneFile, parseZoneFile,
  Person, validateProofs
} from 'blockstack'

import {
  isNameAvailable, getNamePrices,
  resolveZoneFileToProfile,
  signProfileForUpload, authorizationHeaderValue
} from '../utils/index'

import { uploadProfile } from '../storage/utils/index'

import log4js from 'log4js'

const logger = log4js.getLogger('store/identities.js')

const UPDATE_CURRENT = 'UPDATE_CURRENT',
      UPDATE_IDENTITIES = 'UPDATE_IDENTITIES',
      CREATE_NEW = 'CREATE_NEW',
      UPDATE_PROFILE = 'UPDATE_PROFILE',
      CHECKING_NAME_AVAILABILITY = 'CHECK_NAME_AVAILABILITY',
      NAME_AVAILABLE = 'NAME_AVAILABLE',
      NAME_UNAVAILABLE = 'NAME_UNAVAILABLE',
      NAME_AVAILABILITIY_ERROR = 'NAME_AVAILABILITIY_ERROR',
      CHECKING_NAME_PRICE = 'CHECK_NAME_PRICE',
      NAME_PRICE = 'NAME_PRICE',
      NAME_PRICE_ERROR = 'NAME_PRICE_ERROR',
      PROFILE_UPLOADING = 'UPLOAD_LOADING_PROFILE',
      PROFILE_UPLOAD_ERROR = 'PROFILE_UPLOAD_ERROR',
      REGISTRATION_SUBMITTING = 'REGISTRATION_SUBMITTING',
      REGISTRATION_SUBMITTED = 'REGISTRATION_SUBMITTED',
      REGISTRATION_ERROR = 'REGISTRATION_ERROR',
      LOADING_PGP_KEY = 'LOADING_PGP_KEY',
      LOADED_PGP_KEY = 'LOADED_PGP_KEY',
      LOADING_PGP_KEY_ERROR = 'LOADING_PGP_KEY_ERROR'


const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}

function updateCurrentIdentity(domainName, profile, verifications) {
  return {
    type: UPDATE_CURRENT,
    domainName: domainName,
    profile: profile,
    verifications: verifications
  }
}

function createNewIdentity(domainName) {
  return {
    type: CREATE_NEW,
    domainName: domainName
  }
}

function updateOwnedIdentities(localIdentities, namesOwned) {
  return {
    type: UPDATE_IDENTITIES,
    localIdentities: localIdentities,
    namesOwned: namesOwned
  }
}

function updateProfile(domainName, profile) {
  return {
    type: UPDATE_PROFILE,
    domainName: domainName,
    profile: profile
  }
}

function checkingNameAvailability(domainName) {
  return {
    type: CHECKING_NAME_AVAILABILITY,
    domainName: domainName
  }
}

function nameAvailable(domainName) {
  return {
    type: NAME_AVAILABLE,
    domainName: domainName
  }
}

function nameUnavailable(domainName) {
  return {
    type: NAME_UNAVAILABLE,
    domainName: domainName
  }
}

function nameAvailabilityError(domainName, error) {
  return {
    type: NAME_AVAILABILITIY_ERROR,
    domainName: domainName,
    error: error
  }
}

function checkingNamePrice(domainName) {
  return {
    type: CHECKING_NAME_PRICE,
    domainName: domainName
  }
}

function namePrice(domainName, price) {
  return {
    type: NAME_PRICE,
    domainName: domainName,
    price: price
  }
}

function namePriceError(domainName, error) {
  return {
    type: NAME_PRICE_ERROR,
    domainName: domainName,
    error: error
  }
}

function profileUploading() {
  return {
    type: PROFILE_UPLOADING
  }
}

function profileUploadError(error) {
  return {
    type: PROFILE_UPLOAD_ERROR,
    error: error
  }
}

function registrationSubmitting() {
  return {
    type: REGISTRATION_SUBMITTING
  }
}

function registrationSubmitted() {
  return {
    type: REGISTRATION_SUBMITTED
  }
}

function registrationError(error) {
  return {
    type: REGISTRATION_ERROR,
    error: error
  }
}

function loadingPGPKey(identifier) {
  return {
    type: LOADING_PGP_KEY,
    identifier: identifier
  }
}

function loadingPGPKeyError(identifier, error) {
  return {
    type: LOADING_PGP_KEY_ERROR,
    identifier: identifier,
    error: error
  }
}

function loadedPGPKey(identifier, key) {
  return {
    type: LOADED_PGP_KEY,
    identifier: identifier,
    key: key
  }
}

function calculateLocalIdentities(localIdentities, namesOwned) {
  let remoteNamesDict = {},
      localNamesDict = {},
      updatedLocalIdentities = localIdentities

  namesOwned.map(function(name) {
    remoteNamesDict[name] = true
  })

  Object.keys(updatedLocalIdentities).forEach((name) => {
    let identity = updatedLocalIdentities[name]
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.map(function(name) {
    if (!localNamesDict.hasOwnProperty(name)) {
      updatedLocalIdentities[name] = {
        domainName: name,
        profile: {
          '@type': 'Person',
          '@context': 'http://schema.org'
        },
        verifications: [],
        registered: true
      }
    }
  })

  return updatedLocalIdentities
}

function refreshIdentities(api, addresses, localIdentities, lastNameLookup) {
  return dispatch => {
    if (addresses.length === 0) {
      let namesOwned = []
      let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)
      if (JSON.stringify(updatedLocalIdentities) === JSON.stringify(localIdentities)) {
        // pass
      } else {
        dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
      }
    } else {

      let count =  addresses.length
      let namesOwned = []

      addresses.forEach((address) => {
        const url = api.addressLookupUrl.replace('{address}', address)
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => JSON.parse(responseText))
          .then((responseJson) => {
            count++
            namesOwned = namesOwned.concat(responseJson['names'])

            if(count >= addresses.length) {
              let updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)

              if (JSON.stringify(lastNameLookup) === JSON.stringify(namesOwned)) {
                // pass
              } else {
                dispatch(updateOwnedIdentities(updatedLocalIdentities, namesOwned))
                namesOwned.forEach((domainName) => {
                  let identity = updatedLocalIdentities[domainName]
                  const lookupUrl = api.nameLookupUrl.replace('{name}', identity.domainName)
                  fetch(lookupUrl).then((response) => response.text())
                  .then((responseText) => JSON.parse(responseText))
                  .then((responseJson) => {
                    const zoneFile = responseJson.zonefile,
                          ownerAddress = responseJson.address

                    resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
                      if (profile)
                        dispatch(updateProfile(domainName, profile))
                    })
                    .catch((error) => {
                      logger.error('refreshIdentities: resolveZoneFileToProfile: error', error)
                    })
                  })
                  .catch((error) => {
                    logger.error('refreshIdentities: lookupUrl: error', error)
                  })
                })
              }
            }
          }).catch((error) => {
            logger.error('refreshIdentities: addressLookup: error', error)
          })

      })
    }
  }
}

function registerName(api, domainName, recipientAddress, keypair) {
  return dispatch => {
    const signedProfileTokenData = signProfileForUpload(DEFAULT_PROFILE, keypair)

    dispatch(profileUploading())

    uploadProfile(api, domainName, signedProfileTokenData, true).then((profileUrl) => {

      const tokenFileUrl = profileUrl
      const zoneFile = makeProfileZoneFile(domainName, tokenFileUrl)

      const requestHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authorizationHeaderValue(api.coreAPIPassword)
      }

      const requestBody = JSON.stringify({
        name: domainName,
        owner_address: recipientAddress,
        zonefile: zoneFile,
        min_confs: 0
      })

      dispatch(registrationSubmitting())

      fetch(api.registerUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody
      })
        .then((response) => response.text())
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          console.log(responseJson)
          if(responseJson['error']) {
            dispatch(registrationError(responseJson['error']))
          } else {
            dispatch(registrationSubmitted())
            dispatch(createNewIdentity(domainName))
          }
        })
        .catch((error) => {
          logger.error('registerName: error POSTing regitsration to Core', error)
          dispatch(registrationError(error))
        })
      }).catch((error) => {
        logger.error('registerName: error uploading profile', error)
        dispatch(profileUploadError(error))
      })
    }
}

function fetchCurrentIdentity(domainName, lookupUrl) {
  return dispatch => {
    let username
    if (lookupUrl.search('localhost') >= 0) {
      username = domainName
    } else if (lookupUrl.search('api.blockstack.com') >= 0) {
      username = domainName.split('.')[0]
    } else {
      throw "Invalid lookup URL"
    }
    const url = lookupUrl.replace('{name}', username)
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        let zoneFile
        let ownerAddress

        if (lookupUrl.search('localhost') >= 0) {
          zoneFile = responseJson['zonefile']
          ownerAddress = responseJson['address']
        } else if (lookupUrl.search('api.blockstack.com') >= 0) {
          const userData = responseJson[username]
          zoneFile = userData['zone_file']
          ownerAddress = userData['owner_address']
        } else {
          throw "Invalid lookup URL"
        }

        resolveZoneFileToProfile(zoneFile, ownerAddress).then((profile) => {
          let verifications = []
          dispatch(updateCurrentIdentity(domainName, profile, verifications))
          if (profile) {
            validateProofs(profile, domainName).then((proofs) => {
              verifications = proofs
              dispatch(updateCurrentIdentity(domainName, profile, verifications))
            }).catch((error) => {
              logger.error('fetchCurrentIdentity: validateProofs: error', error)
            })
          }
        })
        .catch((error) => {
          logger.error('fetchCurrentIdentity: resolveZoneFileToProfile: error', error)
        })
      })
      .catch((error) => {
        dispatch(updateCurrentIdentity(domainName, null, []))
        logger.error('fetchCurrentIdentity: lookup error', error)
      })
  }
}

function checkNameAvailabilityAndPrice(api, domainName) {
  return dispatch => {

    dispatch(checkingNameAvailability(domainName))

    isNameAvailable(api.nameLookupUrl, domainName).then((isAvailable) => {
      if(isAvailable) {
        dispatch(nameAvailable(domainName))
        dispatch(checkingNamePrice(domainName))
        getNamePrices(api.priceUrl, domainName).then((prices)=> {
            const price = prices.total_estimated_cost.btc
            dispatch(namePrice(domainName, price))
        }).catch((error) => {
          logger.error('checkNameAvailabilityAndPrice: getNamePrices: error', error)
          dispatch(namePriceError(domainName, error))
        })
      } else {
        dispatch(nameUnavailable(domainName))
      }
    }).catch((error) => {
      logger.error('checkNameAvailabilityAndPrice: isNameAvailable: error', error)
      dispatch(nameAvailabilityError(domainName, error))
    })
  }
}

function loadPGPPublicKey(contentUrl, identifier) {
  console.log("loadPGPPublicKey")
  return dispatch => {
    dispatch(loadingPGPKey(identifier))
    proxyFetch(contentUrl)
      .then(response => response.text())
      .then(publicKey => {
        dispatch(loadedPGPKey(identifier, publicKey))
      })
      .catch((e) => {
        logger.error('loadPGPPublicKey: error', error)
        dispatch(loadingPGPKeyError(identifier, e))
      })
  }
}

export const IdentityActions = {
  updateCurrentIdentity: updateCurrentIdentity,
  createNewIdentity: createNewIdentity,
  updateProfile: updateProfile,
  fetchCurrentIdentity: fetchCurrentIdentity,
  refreshIdentities: refreshIdentities,
  updateOwnedIdentities: updateOwnedIdentities,
  registerName: registerName,
  checkNameAvailabilityAndPrice: checkNameAvailabilityAndPrice,
  loadPGPPublicKey: loadPGPPublicKey
}

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  lastNameLookup: [],
  registration: {
    lastNameEntered: null,
    names: {}
  },
  pgpPublicKeys: {}
}

export function IdentityReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          domainName: action.domainName,
          profile: action.profile,
          verifications: action.verifications
        }
      })
    case CREATE_NEW:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: {
            domainName: action.domainName,
            profile: DEFAULT_PROFILE,
            verifications: [],
            registered: false
          }
        })
      })
    case UPDATE_IDENTITIES:
      return Object.assign({}, state, {
        localIdentities: action.localIdentities,
        lastNameLookup: action.namesOwned
      })
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        localIdentities: Object.assign({}, state.localIdentities, {
          [action.domainName]: Object.assign({}, state.localIdentities[action.domainName], {
            profile: action.profile
          })
        })
      })
    case CHECKING_NAME_AVAILABILITY:
      state.registration.names[action.domainName] = {
        checkingAvailability: true,
        available: false,
        checkingPrice: true,
        price: 0.0,
        error: null
      }
      return Object.assign({}, state, {
        registration: {
          names: state.registration.names,
          lastNameEntered: action.domainName
        }
      })
    case NAME_AVAILABLE:
      state.registration.names[action.domainName].checkingAvailability = false
      state.registration.names[action.domainName].available = true
      return Object.assign({}, state, {
        registration: {
          names: state.registration.names,
          lastNameEntered: state.registration.lastNameEntered
        }
      })
    case NAME_UNAVAILABLE:
      return Object.assign({}, state, {
        registration: {
          names: Object.assign({}, state.registration.names, {
            [action.domainName]: Object.assign({},state.registration.names[action.domainName],
            {
              checkingAvailability: false,
              available: false
            })
          }),
          lastNameEntered: state.registration.lastNameEntered
        }
      })
    case NAME_AVAILABILITIY_ERROR:
      return Object.assign({}, state, {
        registration: {
          names: Object.assign({}, state.registration.names, {
            [action.domainName]: Object.assign({},state.registration.names[action.domainName],
            {
              checkingAvailability: false,
              error: action.error
            })
          }),
          lastNameEntered: state.registration.lastNameEntered
        }
      })
    case CHECKING_NAME_PRICE:
    return Object.assign({}, state, {
      registration: {
        names: Object.assign({}, state.registration.names, {
          [action.domainName]: Object.assign({},state.registration.names[action.domainName],
          {
            checkingPrice: true
          })
        }),
        lastNameEntered: state.registration.lastNameEntered
      }
    })
    case NAME_PRICE:
    return Object.assign({}, state, {
      registration: {
        names: Object.assign({}, state.registration.names, {
          [action.domainName]: Object.assign({},state.registration.names[action.domainName],
          {
            checkingPrice: false,
            price: action.price
          })
        }),
        lastNameEntered: state.registration.lastNameEntered
      }
    })
    case NAME_PRICE_ERROR:
    return Object.assign({}, state, {
      registration: {
        names: Object.assign({}, state.registration.names, {
          [action.domainName]: Object.assign({},state.registration.names[action.domainName],
          {
            checkingPrice: false,
            error: action.error
          })
        }),
        lastNameEntered: state.registration.lastNameEntered
      }
    })
    case PROFILE_UPLOADING:
      return Object.assign({}, state, {
        registration: Object.assign({}, state.registration, {
          profileUploading: true,
          error: null,
          preventRegistration: true
        })
      })
    case PROFILE_UPLOAD_ERROR:
      return Object.assign({}, state, {
        registration: Object.assign({}, state.registration, {
          profileUploading: false,
          error: action.error,
          preventRegistration: false
        })
      })
    case REGISTRATION_SUBMITTING:
      return Object.assign({}, state, {
        registration: Object.assign({}, state.registration, {
          profileUploading: false,
          registrationSubmitting: true,
          error: null,
          preventRegistration: true
        })
      })
    case REGISTRATION_SUBMITTED:
      return Object.assign({}, state, {
        registration: Object.assign({}, state.registration, {
          profileUploading: false,
          registrationSubmitting: false,
          registrationSubmitted: true,
          error: null,
          preventRegistration: false
        })
      })
    case REGISTRATION_ERROR:
      return Object.assign({}, state, {
        registration: Object.assign({}, state.registration, {
          registrationSubmitting: false,
          error: action.error,
          preventRegistration: false
        })
      })
    case LOADING_PGP_KEY:
      return Object.assign({}, state, {
        pgpPublicKeys: Object.assign({}, state.pgpPublicKeys, {
          [action.identifier]: {
            loading: true,
            key: null,
            error: null
          }
        })
      })
    case LOADED_PGP_KEY:
      return Object.assign({}, state, {
        pgpPublicKeys: Object.assign({}, state.pgpPublicKeys, {
          [action.identifier]: {
            loading: false,
            key: action.key,
            error: null
          }
        })
      })
    case LOADING_PGP_KEY_ERROR:
      return Object.assign({}, state, {
        pgpPublicKeys: Object.assign({}, state.pgpPublicKeys, {
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

/*{
  domainName: 'ryan.id',
  profile: {},
  verifications: [],
  registered: false,
  blockNumber: null,
  transactionNumber: null
}*/
