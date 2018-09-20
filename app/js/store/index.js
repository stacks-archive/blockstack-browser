import configureStore from './configure'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

function checkForLegacyReduxData() {
  const data = localStorage.getItem('redux')
  logger.debug('peristed data exists: ', JSON.parse(data))
  if (!data) {
    logger.log('no data, continue')
    return null
  }

  const parsedData = JSON.parse(data)
  const { computedStates, currentStateIndex } = parsedData
  if (!computedStates) {
    logger.debug('no computed states')
    return null
  }
  const lastState = computedStates[currentStateIndex]
    ? computedStates[currentStateIndex].state
    : undefined

  if (computedStates && lastState) {
    logger.debug('computed states and last state', lastState)
    localStorage.setItem('redux', JSON.stringify(lastState))
    localStorage.setItem('redux_old', JSON.stringify(parsedData))
    logger.log('finished, returning object')
    return lastState
  }

  return null
}

const legacyStore = checkForLegacyReduxData()
logger.log('legacystore', legacyStore)
const store = configureStore(legacyStore)

export default store
