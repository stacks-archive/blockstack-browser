import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App          from './App'
import ProfilePage  from './pages/ProfilePage'
import EditorPage   from './pages/EditorPage'
import SettingsPage from './pages/SettingsPage'

import RegisterPage       from './pages/RegisterPage'
import ExportPage         from './pages/ExportPage'
import DepositPage        from './pages/DepositPage'
import ImportPage         from './pages/ImportPage'
import BackupPage         from './pages/BackupPage'
import HomePage           from './pages/HomePage'
import SearchPage         from './pages/SearchPage'
import IdentitiesPage     from './pages/IdentitiesPage'
import BookmarksPage      from './pages/BookmarksPage'
import NewPasswordPage    from './pages/NewPasswordPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={BookmarksPage} />
    <Route path="profile/local/:index"        component={ProfilePage} />
    <Route path="profile/local/:index/edit"   component={EditorPage} />
    <Route path="profile/local/:index/export" component={ExportPage} />
    <Route path="profile/:name"               component={ProfilePage} />
    <Route path="settings"       component={SettingsPage} />
    <Route path="register"       component={RegisterPage} />
    <Route path="deposit"        component={DepositPage} />
    <Route path="import"         component={ImportPage} />
    <Route path="backup"         component={BackupPage} />
    <Route path="home"           component={HomePage} />
    <Route path="search/:query"  component={SearchPage} />
    <Route path="identities"     component={IdentitiesPage} />
    <Route path="bookmarks"      component={BookmarksPage} />
    <Route path="newpassword"    component={NewPasswordPage} />
  </Route>
)
