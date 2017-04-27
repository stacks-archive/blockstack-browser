import * as types from './types'
import log4js from 'log4js'

import { isCoreApiRunning } from '../../utils/api-utils'

const logger = log4js.getLogger('store/sanity/actions.js')

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

function isCoreRunning(corePingUrl) {
  logger.debug(`isCoreRunning: ${corePingUrl}`)
  return dispatch =>
    isCoreApiRunning(corePingUrl)
    .then((running) => {
      if (running)  {
        dispatch(coreIsRunning())
      } else {
        dispatch(coreIsNotRunning())
      }
    })
    .catch((error) => {
      // Promise returned should always resolve even if there is an error
      logger.error('isCoreApiRunning returned an unexpected error', error)
    })
}

const SanityActions = {
  coreIsNotRunning,
  coreIsRunning,
  isCoreRunning
}

export default SanityActions
