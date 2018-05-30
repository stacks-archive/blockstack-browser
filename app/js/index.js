import 'babel-polyfill'
import 'inert-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import routes from './routes'
import configureDataStore from './store/configure/index'
import { ThemeProvider } from 'styled-components'
import theme from '@styled/theme'

import log4js from 'log4js'
import { authorizationHeaderValue } from './utils/api-utils'
import { configureLogging } from './utils/logging-utils'

const store = configureDataStore()
const state = store.getState()
const coreAPIPassword = state.settings.api.coreAPIPassword
const logServerPort = state.settings.api.logServerPort

configureLogging(
  log4js,
  logServerPort,
  authorizationHeaderValue(coreAPIPassword),
  process.env.NODE_ENV
)

window.addEventListener('error', event => {
  const logger = log4js.getLogger("window.addWindowListener('error')")
  logger.error(event)
})

window.onerror = (messageOrEvent, source, lineno, colno, error) => {
  const logger = log4js.getLogger('window.onerror')
  logger.error(messageOrEvent, error)
}

const logger = log4js.getLogger('index.js')

if (process.env.NODE_ENV !== 'production') {
  logger.trace('NODE_ENV is not production')
  logger.debug('Enabling React devtools')
  window.React = React
}

const checkForLegacyReduxData = async () => {
  const reduxPersistedState = JSON.parse(localStorage.getItem('redux'))

  /**
   * For testing only:
   *
   * changing the BLOCKSTACK_STATE_VERSION to anything less than 14 will cause an update
   */
  // const oldState = JSON.parse(localStorage.getItem('redux_old'))
  // const BLOCKSTACK_STATE_VERSION = JSON.parse(
  //   localStorage.getItem('BLOCKSTACK_STATE_VERSION')
  // )
  //
  // // localStorage.setItem('redux', JSON.stringify(oldState))
  // // localStorage.setItem('BLOCKSTACK_STATE_VERSION', 13)

  if (reduxPersistedState) {
    const { computedStates, currentStateIndex } = reduxPersistedState
    if (!computedStates) {
      return null
    }
    const lastState = computedStates[currentStateIndex]
      ? computedStates[currentStateIndex].state
      : undefined

    if (computedStates && lastState) {
      localStorage.setItem('redux', JSON.stringify(lastState))
      localStorage.setItem('redux_old', JSON.stringify(reduxPersistedState))
      return lastState
    }

    return null
  }
  return null
}

checkForLegacyReduxData().then(() =>
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{routes}</ThemeProvider>
    </Provider>,
    document.getElementById('app')
  )
)
