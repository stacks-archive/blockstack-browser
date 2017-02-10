'use strict'

import React                        from 'react'
import {
    Router, Route, IndexRoute,
    browserHistory
}                                   from 'react-router'

import App                from './App'

import DashboardPage      from './pages/DashboardPage'

import AllProfilesPage     from './pages/profiles/AllProfilesPage'
import ViewProfilePage     from './pages/profiles/ViewProfilePage'
import EditProfilePage     from './pages/profiles/EditProfilePage'
import RegisterProfilePage from './pages/profiles/RegisterProfilePage'
import ImportProfilePage   from './pages/profiles/ImportProfilePage'
import ExportProfilePage   from './pages/profiles/ExportProfilePage'
import SearchProfilesPage  from './pages/profiles/SearchProfilesPage'

import SettingsPage       from './pages/account/SettingsPage'
import DeleteAccountPage  from './pages/account/DeleteAccountPage'
import BackupAccountPage  from './pages/account/BackupAccountPage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'
import CreateAccountPage  from './pages/account/CreateAccountPage'
import RestoreAccountPage from './pages/account/RestoreAccountPage'

import AuthPage           from './pages/auth/AuthPage'

import DepositPage        from './pages/wallet/DepositPage'
import WithdrawPage       from './pages/wallet/WithdrawPage'

import NotFoundPage       from './pages/errors/NotFoundPage'

export default (
<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute     component={DashboardPage} />

    <Route path="/profiles"                     component={AllProfilesPage} />
    <Route path="/profiles/search/:query"       component={SearchProfilesPage} />
    <Route path="/profiles/blockchain/:name"    component={ViewProfilePage} />
    <Route path="/profiles/local/:index"        component={ViewProfilePage} />
    <Route path="/profiles/local/:index/edit"   component={EditProfilePage} />
    <Route path="/profiles/local/:index/export" component={ExportProfilePage} />
    <Route path="/profiles/register"            component={RegisterProfilePage} />
    <Route path="/profiles/import"              component={ImportProfilePage} />

    <Route path="/account/delete"      component={DeleteAccountPage} />
    <Route path="/account/backup"      component={BackupAccountPage} />
    <Route path="/account/password"    component={ChangePasswordPage} />
    <Route path="/account/settings"    component={SettingsPage} />

    <Route path="/account/create"      component={CreateAccountPage} />
    <Route path="/account/restore"     component={RestoreAccountPage} />

    <Route path="/account/deposit"     component={DepositPage} />
    <Route path="/account/withdraw"    component={WithdrawPage} />

    <Route path="/auth"                component={AuthPage} />

    <Route path="/*" component={NotFoundPage} />
  </Route>
</Router> 
)
