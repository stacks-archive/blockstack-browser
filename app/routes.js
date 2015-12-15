import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App          from './containers/App'
import ProfilePage  from './pages/ProfilePage'
import EditorPage   from './pages/EditorPage'
import SettingsPage from './pages/SettingsPage'
import CounterPage  from './pages/CounterPage'

import RegisterPage from './pages/RegisterPage'
import ExportPage   from './pages/ExportPage'
import ImportPage   from './pages/ImportPage'
import BackupPage   from './pages/BackupPage'
import TasksPage    from './pages/TasksPage'
import SearchPage   from './pages/SearchPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={TasksPage} />

    <Route path="/profile/:id" component={ProfilePage} />
    <Route path="/editor" component={EditorPage} />
    <Route path="/settings" component={SettingsPage} />
    <Route path="/counter" component={CounterPage} />

    <Route path="/register" component={RegisterPage} />
    <Route path="/export" component={ExportPage} />
    <Route path="/import" component={ImportPage} />
    <Route path="/backup" component={BackupPage} />
    <Route path="/tasks" component={TasksPage} />
    <Route path="/search" component={SearchPage} />
  </Route>
)
