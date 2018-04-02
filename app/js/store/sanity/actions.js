import * as types from './types'
import log4js from 'log4js'

import { isApiPasswordValid, isCoreApiRunning } from '@utils/api-utils'

const logger = log4js.getLogger('store/sanity/actions.js')

function coreApiPasswordIsNotValid() {
  return {
    type: types.CORE_API_PASSWORD_NOT_VALID
  }
}

function coreApiPasswordIsValid() {
  return {
    type: types.CORE_API_PASSWORD_VALID
  }
}

function coreIsNotRunning() {
  return {
    type: types.CORE_IS_NOT_RUNNING
  }
}

function coreIsRunning() {
  return {
    type: types.CORE_IS_RUNNING
  }
}

function isCoreApiPasswordValid(corePasswordProtectedReadUrl, coreApiPassword) {
  logger.debug(`isCoreApiPasswordValid: ${corePasswordProtectedReadUrl}`)
  return dispatch =>
    isApiPasswordValid(corePasswordProtectedReadUrl, coreApiPassword)
      .then(valid => {
        if (valid) {
          logger.debug('isCoreApiPasswordValid? Yes!')
          dispatch(coreApiPasswordIsValid())
          dispatch(coreIsRunning())
        } else {
          logger.debug('isCoreApiPasswordValid? No!')
          dispatch(coreApiPasswordIsNotValid())
        }
      })
      .catch(error => {
        // Promise returned should always resolve even if there is an error
        logger.error('isCoreApiPasswordValid returned an unexpected error', error)
      })
}

function isCoreRunning(corePingUrl) {
  logger.debug(`isCoreRunning: ${corePingUrl}`)
  return dispatch =>
    isCoreApiRunning(corePingUrl)
      .then(running => {
        if (running) {
          dispatch(coreIsRunning())
        } else {
          dispatch(coreIsNotRunning())
        }
      })
      .catch(error => {
        // Promise returned should always resolve even if there is an error
        logger.error('isCoreApiRunning returned an unexpected error', error)
      })
}

const SanityActions = {
  coreApiPasswordIsNotValid,
  coreApiPasswordIsValid,
  coreIsNotRunning,
  coreIsRunning,
  isCoreApiPasswordValid,
  isCoreRunning
}

export default SanityActions
