import { validateProofs } from 'blockstack'

import {
  isNameAvailable, getNamePrices,
  resolveZoneFileToProfile
} from '../../utils/index'

import { DEFAULT_PROFILE } from '../../utils/profile-utils'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/store/identities.js')

const UPDATE_CURRENT = 'UPDATE_CURRENT',
      UPDATE_IDENTITIES = 'UPDATE_IDENTITIES',
      CREATE_NEW = 'CREATE_NEW',
      UPDATE_PROFILE = 'UPDATE_PROFILE'
export const CHECKING_NAME_AVAILABILITY = 'CHECK_NAME_AVAILABILITY'
export const NAME_AVAILABLE = 'NAME_AVAILABLE'
export const NAME_UNAVAILABLE = 'NAME_UNAVAILABLE'
export const NAME_AVAILABILITIY_ERROR = 'NAME_AVAILABILITIY_ERROR'
export const CHECKING_NAME_PRICE = 'CHECK_NAME_PRICE'
export const NAME_PRICE = 'NAME_PRICE'
export const NAME_PRICE_ERROR = 'NAME_PRICE_ERROR'

function updateCurrentIdentity(domainName, profile, verifications) {
  return {
    type: UPDATE_CURRENT,
    domainName: domainName,
    profile: profile,
    verifications: verifications,
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

function createNewIdentityFromDomain(domainName) {
  return dispatch => {
    dispatch(createNewIdentity(domainName))
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
    const identity = updatedLocalIdentities[name]
    localNamesDict[identity.domainName] = true
    if (remoteNamesDict.hasOwnProperty(identity.domainName)) {
      identity.registered = true
    }
  })

  namesOwned.map((name) => {
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
  logger.trace('refreshIdentities')
  return dispatch => {
    if (addresses.length === 0) {
      const namesOwned = []
      const updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)
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
            namesOwned = namesOwned.concat(responseJson.names)

            if (count >= addresses.length) {
              const updatedLocalIdentities = calculateLocalIdentities(localIdentities, namesOwned)

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
              logger.error(`fetchCurrentIdentity: ${domainName} validateProofs: error`, error)
            })
          }
        })
        .catch((error) => {
          logger.error(`fetchCurrentIdentity: ${domainName} resolveZoneFileToProfile: error`, error)
        })
      })
      .catch((error) => {
        dispatch(updateCurrentIdentity(domainName, null, []))
        logger.error(`fetchCurrentIdentity: ${domainName} lookup error`, error)
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


export const IdentityActions = {
  updateCurrentIdentity: updateCurrentIdentity,
  createNewIdentity: createNewIdentity,
  updateProfile: updateProfile,
  fetchCurrentIdentity: fetchCurrentIdentity,
  refreshIdentities: refreshIdentities,
  updateOwnedIdentities: updateOwnedIdentities,
  checkNameAvailabilityAndPrice: checkNameAvailabilityAndPrice,
  createNewIdentityFromDomain
}

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  lastNameLookup: [],
  availability: {
    names: {},
    lastNameEntered: null
  }
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
      const availability = state.availability
      let names
      if(state.availability) {
        names = state.availability.names
      } else {
        names = {}
      }
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, names, {
            [action.domainName]: Object.assign({}, names[action.domainName], {
              checkingAvailability: true,
              available: false,
              checkingPrice: true,
              price: 0.0,
              error: null
            })
          }),
          lastNameEntered: action.domainName
        }
      })
    case NAME_AVAILABLE:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName], {
              checkingAvailability: false,
              available: true
            })
          }),
          lastNameEntered: action.domainName
        }
      })
    case NAME_UNAVAILABLE:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName],
              {
                checkingAvailability: false,
                available: false
              })
          }),
          lastNameEntered: state.availability.lastNameEntered
        }
      })
    case NAME_AVAILABILITIY_ERROR:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName],
              {
                checkingAvailability: false,
                error: action.error
              })
          }),
          lastNameEntered: state.availability.lastNameEntered
        }
      })
    case CHECKING_NAME_PRICE:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName],
              {
                checkingPrice: true
              })
          }),
          lastNameEntered: state.availability.lastNameEntered
        }
      })
    case NAME_PRICE:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName],
              {
                checkingPrice: false,
                price: action.price
              })
          }),
          lastNameEntered: state.availability.lastNameEntered
        }
      })
    case NAME_PRICE_ERROR:
      return Object.assign({}, state, {
        availability: {
          names: Object.assign({}, state.availability.names, {
            [action.domainName]: Object.assign({}, state.availability.names[action.domainName],
              {
                checkingPrice: false,
                error: action.error
              })
          }),
          lastNameEntered: state.availability.lastNameEntered
        }
      })
    default:
      return state
  }
}
