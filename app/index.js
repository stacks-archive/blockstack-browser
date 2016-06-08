import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, useRouterHistory } from 'react-router'
import { createHashHistory } from 'history/lib'

import routes from './routes'
import configureDataStore from './store/configure/index'

import './app.global.css'

import { setUpContextMenu } from './contextMenu'

const store = configureDataStore()

const appHistory = useRouterHistory(createHashHistory)({ queryKey: false })

//setUpContextMenu()

render(
  <Provider store={store}>
    <Router history={appHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
)