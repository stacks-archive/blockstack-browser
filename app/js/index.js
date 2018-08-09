import React from 'react'

import 'babel-polyfill'
import 'inert-polyfill'

import '../styles/bootstrap.min.css'
import '../styles/fonts.css'
import '../styles/font-awesome.css'
import '../styles/app.css'

import { render } from 'react-dom'
import { Provider } from 'react-redux'

import routes from './routes'
import { ThemeProvider } from 'styled-components'
import theme from '@styled/theme'

import log4js from 'log4js'
import { authorizationHeaderValue } from './utils/api-utils'
import { configureLogging } from './utils/logging-utils'
import store from './store'

const state = store.getState()
const coreAPIPassword = state.settings.api.coreAPIPassword
const logServerPort = state.settings.api.logServerPort

configureLogging(
  log4js,
  logServerPort,
  authorizationHeaderValue(coreAPIPassword),
  process.env.NODE_ENV
)

let logger = log4js.getLogger('index.js')


window.addEventListener('error', event => {
  // eslint-disable-next-line
  logger = log4js.getLogger("window.addWindowListener('error')")
  logger.error(event)
})

window.onerror = (messageOrEvent, source, lineno, colno, error) => {
  logger = log4js.getLogger('window.onerror')
  logger.error(messageOrEvent, error)
}


configureLogging(
  log4js,
  logServerPort,
  authorizationHeaderValue(coreAPIPassword),
  process.env.NODE_ENV
)

if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration)
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

window.addEventListener('error', event => {
  // eslint-disable-next-line
  logger = log4js.getLogger("window.addWindowListener('error')")
  logger.error(event)
})

window.onerror = (messageOrEvent, source, lineno, colno, error) => {
  logger = log4js.getLogger('window.onerror')
  logger.error(messageOrEvent, error)
}

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


if (module.hot) {
  module.hot.accept()
}
