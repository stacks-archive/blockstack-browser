import * as types from './types'

import log4js from 'log4js'

import {
  isNameAvailable, getNamePrices
} from '@utils/index'

const logger = log4js.getLogger(__filename)

function checkingNameAvailability(domainName) {
  return {
    type: types.CHECKING_NAME_AVAILABILITY,
    domainName
  }
}

function nameAvailable(domainName) {
  return {
    type: types.NAME_AVAILABLE,
    domainName
  }
}

function nameUnavailable(domainName) {
  return {
    type: types.NAME_UNAVAILABLE,
    domainName
  }
}

function nameAvailabilityError(domainName, error) {
  return {
    type: types.NAME_AVAILABILITY_ERROR,
    domainName,
    error
  }
}

function checkingNamePrice(domainName) {
  return {
    type: types.CHECKING_NAME_PRICE,
    domainName
  }
}

function namePrice(domainName, price) {
  return {
    type: types.NAME_PRICE,
    domainName,
    price
  }
}

function namePriceError(domainName, error) {
  return {
    type: types.NAME_PRICE_ERROR,
    domainName,
    error
  }
}

function checkNameAvailabilityAndPrice(api, domainName) {
  return dispatch => {
    dispatch(checkingNameAvailability(domainName))
    logger.debug(`checkNameAvailabilityAndPrice: ${domainName}`)
    const nameTokens = domainName.split('.')
    const isSubdomain = nameTokens.length === 3
    if (isSubdomain) {
      const subdomain = `${nameTokens[1]}.${nameTokens[2]}`
      logger.debug(`checkNameAvailabilityAndPrice: subdomain ${subdomain}`)
      if (!api.subdomains[subdomain]) {
        logger.error(`checkNameAvailabilityAndPrice: no config for subdomain ${subdomain}`)
        dispatch(nameAvailabilityError(domainName, `no config for subdomain ${subdomain}`))
      }
    }
    return isNameAvailable(api.nameLookupUrl, domainName).then((isAvailable) => {
      if (isAvailable) {
        dispatch(nameAvailable(domainName))
        dispatch(checkingNamePrice(domainName))
        if (isSubdomain) {
          // we only currently support free subdomains
          dispatch(namePrice(domainName, 0))
        } else {
          return getNamePrices(api.priceUrl, domainName).then((prices) => {
            const price = prices.name_price.satoshis * 0.000001
            dispatch(namePrice(domainName, price))
          }).catch((error) => {
            logger.error('checkNameAvailabilityAndPrice: getNamePrices: error', error)
            dispatch(namePriceError(domainName, error))
          })
        }
      } else {
        dispatch(nameUnavailable(domainName))
      }
      return null
    }).catch((error) => {
      logger.error('checkNameAvailabilityAndPrice: isNameAvailable: error', error)
      dispatch(nameAvailabilityError(domainName, error))
    })
  }
}

const AvailabilityActions = {
  checkingNameAvailability,
  nameAvailable,
  nameUnavailable,
  nameAvailabilityError,
  checkingNamePrice,
  namePrice,
  namePriceError,
  checkNameAvailabilityAndPrice
}

export default AvailabilityActions
