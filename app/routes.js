import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App          from './containers/App'
import ProfilePage  from './pages/ProfilePage'
import EditorPage   from './pages/EditorPage'
import SettingsPage from './pages/SettingsPage'
import CounterPage  from './pages/CounterPage'

import RegisterPage      from './pages/RegisterPage'
import ExportPage        from './pages/ExportPage'
import DepositPage       from './pages/DepositPage'
import ImportPage        from './pages/ImportPage'
import BackupPage        from './pages/BackupPage'
import NotificationsPage from './pages/NotificationsPage'
import SearchPage        from './pages/SearchPage'
import HomePage          from './pages/HomePage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={NotificationsPage} />

    <Route path="/profile/:id"        component={ProfilePage} />
    <Route path="/profile/:id/edit"   component={EditorPage} />
    <Route path="/profile/:id/export" component={ExportPage} />
    <Route path="/settings"      component={SettingsPage} />
    <Route path="/register"      component={RegisterPage} />
    <Route path="/deposit"        component={DepositPage} />
    <Route path="/import"        component={ImportPage} />
    <Route path="/backup"        component={BackupPage} />
    <Route path="/notifications" component={NotificationsPage} />
    <Route path="/search"        component={SearchPage} />
    <Route path="/counter"       component={CounterPage} />
  </Route>
)
