'use strict'

import React                        from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App                  from './App'
import DashboardPage        from './DashboardPage'

import ProfilesApp          from './profiles/ProfilesApp'
import AllProfilesPage      from './profiles/AllProfilesPage'
import ViewProfilePage      from './profiles/ViewProfilePage'
import EditProfilePage      from './profiles/EditProfilePage'
import RegisterProfilePage  from './profiles/RegisterProfilePage'
import ImportProfilePage    from './profiles/ImportProfilePage'
import ExportProfilePage    from './profiles/ExportProfilePage'
import SearchProfilesPage   from './profiles/SearchProfilesPage'

import AccountApp           from './account/AccountApp'
import DeleteAccountPage    from './account/DeleteAccountPage'
import BackupAccountPage    from './account/BackupAccountPage'
import ChangePasswordPage   from './account/ChangePasswordPage'
import CreateAccountPage    from './account/CreateAccountPage'
import RestoreAccountPage   from './account/RestoreAccountPage'
import ApiSettingsPage      from './account/ApiSettingsPage'

import WalletApp            from './wallet/WalletApp'
import DepositPage          from './wallet/DepositPage'
import WithdrawPage         from './wallet/WithdrawPage'

import StorageApp           from './storage/StorageApp'
import StorageProvidersPage from './storage/StorageProvidersPage'

import AuthPage             from './auth/AuthPage'

import NotFoundPage         from './errors/NotFoundPage'

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
        <Route path="deposit"     component={DepositPage} />
        <Route path="withdraw"    component={WithdrawPage} />
    </Route>

    <Route path="/auth" component={AuthPage} />
    <Route path="/*" component={NotFoundPage} />
  </Route>
</Router>
)
