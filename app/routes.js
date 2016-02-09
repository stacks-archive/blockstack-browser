import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App                from './App'

import DashboardPage      from './pages/DashboardPage'
import SearchPage         from './pages/SearchPage'

import ViewProfilePage    from './pages/identity/ViewProfilePage'
import RegisterPage       from './pages/identity/RegisterPage'
import ImportPage         from './pages/identity/ImportPage'
import ExportPage         from './pages/identity/ExportPage'

import EditProfilePage    from './pages/editing/EditProfilePage'

import DepositPage        from './pages/wallet/DepositPage'
import WithdrawPage       from './pages/wallet/WithdrawPage'

import SettingsPage       from './pages/account/SettingsPage'
import DeleteAccountPage  from './pages/account/DeleteAccountPage'
import BackupAccountPage  from './pages/account/BackupAccountPage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'

import CreateAccountPage  from './pages/outside/CreateAccountPage'
import RestoreAccountPage from './pages/outside/RestoreAccountPage'

import NotFoundPage       from './pages/errors/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage} />

    <Route path="profile/blockchain/:name"    component={ViewProfilePage} />
    <Route path="profile/local/:index"        component={ViewProfilePage} />
    <Route path="profile/local/:index/edit"   component={EditProfilePage} />
    <Route path="profile/local/:index/export" component={ExportPage} />

    <Route path="search/:query"  component={SearchPage} />

    <Route path="home"          component={DashboardPage} />

    <Route path="identities/register" component={RegisterPage} />
    <Route path="identities/import"   component={ImportPage} />

    <Route path="account/deposit"  component={DepositPage} />
    <Route path="account/withdraw" component={WithdrawPage} />
    <Route path="account/delete"   component={DeleteAccountPage} />
    <Route path="account/backup"   component={BackupAccountPage} />
    <Route path="account/password"  component={ChangePasswordPage} />
    <Route path="account/settings" component={SettingsPage} />

    <Route path="account/create"   component={CreateAccountPage} />
    <Route path="account/restore"  component={RestoreAccountPage} />

    <Route path="*" component={NotFoundPage} />
  </Route>
)
