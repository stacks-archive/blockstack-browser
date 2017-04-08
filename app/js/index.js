import React                        from 'react'
import { render }                   from 'react-dom'
import { Provider }                 from 'react-redux'

import routes                       from './routes'
import configureDataStore           from './store/configure/index'
import log4js                       from './utils/logging-utils'

const logger = log4js.getLogger('index.js')

const store = configureDataStore()

if (process.env.NODE_ENV !== 'production') {
  logger.trace('NODE_ENV is not production')
  logger.debug('Enabling React devtools')
  window.React = React
}

render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app')
)
