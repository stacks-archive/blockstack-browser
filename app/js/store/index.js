import configureStore from './configure'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

function checkForLegacyReduxData() {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null
  }
  const data = localStorage.getItem('redux')
  logger.debug('Persisted data exists: ', JSON.parse(data))
  if (!data) {
    logger.log('No persisted data')
    return null
  }

  const parsedData = JSON.parse(data)
  const { computedStates, currentStateIndex } = parsedData
  if (!computedStates) {
    logger.debug('No computed states')
    return null
  }
  const lastState = computedStates[currentStateIndex]
    ? computedStates[currentStateIndex].state
    : undefined

  if (computedStates && lastState) {
    logger.debug('Computed states exists. lastState: ', lastState)
    localStorage.setItem('redux', JSON.stringify(lastState))
    localStorage.setItem('redux_old', JSON.stringify(parsedData))
    logger.log('Finished, returning lastState')
    return lastState
  }

  return null
}

const legacyStore = checkForLegacyReduxData()
logger.log('legacystore', legacyStore)
const store = configureStore(legacyStore)

export default store
