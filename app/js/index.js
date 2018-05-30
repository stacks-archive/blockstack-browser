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

const asyncLocalStorage = {
  setItem: function(key, value) {
    return Promise.resolve().then(function() {
      localStorage.setItem(key, value)
    })
  },
  getItem: function(key) {
    return Promise.resolve().then(function() {
      return localStorage.getItem(key)
    })
  }
}

const checkForLegacyReduxData = async () => {
  const data = await asyncLocalStorage.getItem('redux')
  console.log('localstorage get', JSON.parse(data))
  if (!data) {
    console.log('no data, continue')
    return null
  }

  const parsedData = JSON.parse(data)
  const { computedStates, currentStateIndex } = parsedData
  if (!computedStates) {
    console.debug('no computed states')
    return null
  }
  const lastState = computedStates[currentStateIndex]
    ? computedStates[currentStateIndex].state
    : undefined

  if (computedStates && lastState) {
    console.debug('computed states and last state', lastState)
    await asyncLocalStorage.setItem('redux', JSON.stringify(lastState))
    await asyncLocalStorage.setItem('redux_old', JSON.stringify(parsedData))
    console.log('finished, returning object')
    return lastState
  }

  return null
}
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

checkForLegacyReduxData().then(legacyStore => {
  console.log('legacystore', legacyStore)
  const store = configureDataStore(legacyStore)
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
  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>{routes}</ThemeProvider>
    </Provider>,
    document.getElementById('app')
  )
})
