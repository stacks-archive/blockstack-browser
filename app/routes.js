import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './containers/App'
import ProfilePage from './containers/ProfilePage'
import EditorPage from './containers/EditorPage'
import SettingsPage from './containers/SettingsPage'
import CounterPage from './containers/CounterPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={ProfilePage} />
    <Route path="/profile" component={ProfilePage} />
    <Route path="/update" component={EditorPage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/counter" component={CounterPage} />
  </Route>
)
