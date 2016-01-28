import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App             from './App'

import ViewProfilePage     from './pages/ViewProfilePage'
import EditProfilePage     from './pages/EditProfilePage'

import IdentitiesPage  from './pages/IdentitiesPage'
import RegisterPage    from './pages/RegisterPage'
import ImportPage      from './pages/ImportPage'
import ExportPage      from './pages/ExportPage'

import SearchPage      from './pages/SearchPage'

import WalletPage   from './pages/WalletPage'
import DepositPage  from './pages/DepositPage'
import WithdrawPage from './pages/WithdrawPage'

import SettingsPage       from './pages/SettingsPage'
import CreateAccountPage  from './pages/CreateAccountPage'
import RestoreAccountPage from './pages/RestoreAccountPage'
import DeleteAccountPage  from './pages/DeleteAccountPage'
import BackupAccountPage  from './pages/BackupAccountPage'
import ChangePasswordPage from './pages/ChangePasswordPage'

import NotFoundPage from './pages/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={CreateAccountPage} />

    <Route path="profile/blockchain/:name"    component={ViewProfilePage} />
    <Route path="profile/local/:index"        component={ViewProfilePage} />
    <Route path="profile/local/:index/edit"   component={EditProfilePage} />
    <Route path="profile/local/:index/export" component={ExportPage} />

    <Route path="search/:query"  component={SearchPage} />

    <Route path="identities"          component={IdentitiesPage} />
    <Route path="identities/register" component={RegisterPage} />
    <Route path="identities/import"   component={ImportPage} />

    <Route path="wallet"          component={WalletPage} />
    <Route path="wallet/deposit"  component={DepositPage} />
    <Route path="wallet/withdraw" component={WithdrawPage} />

    <Route path="settings"         component={SettingsPage} />
    <Route path="account/create"   component={CreateAccountPage} />
    <Route path="account/restore"  component={RestoreAccountPage} />
    <Route path="account/delete"   component={DeleteAccountPage} />
    <Route path="account/backup"   component={BackupAccountPage} />
    <Route path="password/update"  component={ChangePasswordPage} />

    <Route path="*" component={NotFoundPage} />
  </Route>
)
