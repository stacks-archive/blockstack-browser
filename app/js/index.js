'use strict'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, useRouterHistory, browserHistory } from 'react-router'

import routes from './routes'
import configureDataStore from './store/configure/index'

const store = configureDataStore()

//const appHistory = useRouterHistory()({ queryKey: false })

if (process.env.NODE_ENV !== 'production') {
  // Enable React devtools
  window.React = React;
}

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app')
)
