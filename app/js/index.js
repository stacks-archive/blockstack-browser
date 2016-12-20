'use strict'

import React                        from 'react'
import { render }                   from 'react-dom'
import { Provider }                 from 'react-redux'

import routes                       from './routes'
import configureDataStore           from './store/configure/index'

const store = configureDataStore()

if (process.env.NODE_ENV !== 'production') {
  // Enable React devtools
  window.React = React;
}

render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('app')
)
