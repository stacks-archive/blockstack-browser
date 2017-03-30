'use strict'

import React                        from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App                from './App'

import DashboardPage      from './pages/DashboardPage'

import ProfilesApp         from './pages/profiles/ProfilesApp'
import AllProfilesPage     from './pages/profiles/AllProfilesPage'
import ViewProfilePage     from './pages/profiles/ViewProfilePage'
import EditProfilePage     from './pages/profiles/EditProfilePage'
import RegisterProfilePage from './pages/profiles/RegisterProfilePage'
import ImportProfilePage   from './pages/profiles/ImportProfilePage'
import ExportProfilePage   from './pages/profiles/ExportProfilePage'
import SearchProfilesPage  from './pages/profiles/SearchProfilesPage'

import AccountApp         from './pages/account/AccountApp'
import DeleteAccountPage  from './pages/account/DeleteAccountPage'
import BackupAccountPage  from './pages/account/BackupAccountPage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'
import CreateAccountPage  from './pages/account/CreateAccountPage'
import RestoreAccountPage from './pages/account/RestoreAccountPage'
import ApiSettingsPage       from './pages/account/ApiSettingsPage'

import WalletApp          from './pages/wallet/WalletApp'
import ReceivePage        from './pages/wallet/ReceivePage'
import SendPage       from './pages/wallet/SendPage'

import StorageApp          from './pages/storage/StorageApp'
import StorageProvidersPage from './pages/storage/StorageProvidersPage'


import AuthPage           from './pages/auth/AuthPage'

import NotFoundPage       from './pages/errors/NotFoundPage'

export default (
<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage} />

    <Route path="profiles" component={ProfilesApp}>
        <IndexRoute component={AllProfilesPage} />
        <Route path="i/search/:query" component={SearchProfilesPage} />
        <Route path=":name"           component={ViewProfilePage} />
        <Route path=":index/local"    component={ViewProfilePage} />
        <Route path=":index/edit"     component={EditProfilePage} />
        <Route path=":index/export"   component={ExportProfilePage} />
        <Route path="i/register"      component={RegisterProfilePage} />
        <Route path="i/import"        component={ImportProfilePage} />
    </Route>

    <Route path="account" component={AccountApp}>
        <Route path="delete"      component={DeleteAccountPage} />
        <Route path="backup"      component={BackupAccountPage} />
        <Route path="password"    component={ChangePasswordPage} />
        <Route path="create"      component={CreateAccountPage} />
        <Route path="restore"     component={RestoreAccountPage} />
        <Route path="api"         component={ApiSettingsPage} />
    </Route>

    <Route path="storage" component={StorageApp}>
        <Route path="providers"     component={StorageProvidersPage} />
    </Route>

    <Route path="wallet" component={WalletApp}>
        <Route path="receive"     component={ReceivePage} />
        <Route path="send"        component={SendPage} />
    </Route>

    <Route path="/auth" component={AuthPage} />
    <Route path="/*" component={NotFoundPage} />
  </Route>
</Router>
)
