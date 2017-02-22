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
import SettingsPage       from './pages/account/SettingsPage'
import DeleteAccountPage  from './pages/account/DeleteAccountPage'
import BackupAccountPage  from './pages/account/BackupAccountPage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'
import CreateAccountPage  from './pages/account/CreateAccountPage'
import RestoreAccountPage from './pages/account/RestoreAccountPage'

import WalletApp          from './pages/wallet/WalletApp'
import DepositPage        from './pages/wallet/DepositPage'
import WithdrawPage       from './pages/wallet/WithdrawPage'

import AuthPage           from './pages/auth/AuthPage'

import NotFoundPage       from './pages/errors/NotFoundPage'

export default (
<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage} />

    <Route path="profiles" component={ProfilesApp}>
        <IndexRoute component={AllProfilesPage} />
        <Route path="search/:query"       component={SearchProfilesPage} />
        <Route path="blockchain/:name"    component={ViewProfilePage} />
        <Route path="local/:index"        component={ViewProfilePage} />
        <Route path="local/:index/edit"   component={EditProfilePage} />
        <Route path="local/:index/export" component={ExportProfilePage} />
        <Route path="register"            component={RegisterProfilePage} />
        <Route path="import"              component={ImportProfilePage} />
    </Route>

    <Route path="account" component={AccountApp}>
        <Route path="delete"      component={DeleteAccountPage} />
        <Route path="backup"      component={BackupAccountPage} />
        <Route path="password"    component={ChangePasswordPage} />
        <Route path="settings"    component={SettingsPage} />
        <Route path="create"      component={CreateAccountPage} />
        <Route path="restore"     component={RestoreAccountPage} />
    </Route>

    <Route path="wallet" component={WalletApp}>
        <Route path="deposit"     component={DepositPage} />
        <Route path="withdraw"    component={WithdrawPage} />
    </Route>

    <Route path="/auth" component={AuthPage} />
    <Route path="/*" component={NotFoundPage} />
  </Route>
</Router>
)
