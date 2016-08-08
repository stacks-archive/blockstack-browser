import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App                from './App'

import DashboardPage      from './pages/DashboardPage'
import SearchPage         from './pages/SearchPage'

import RegisterPage       from './pages/names/RegisterPage'
import ImportPage         from './pages/names/ImportPage'
import ExportPage         from './pages/names/ExportPage'

import ViewProfilePage    from './pages/profiles/ViewProfilePage'
import EditProfilePage    from './pages/profiles/EditProfilePage'

import DepositPage        from './pages/account/DepositPage'
import WithdrawPage       from './pages/account/WithdrawPage'

import SettingsPage       from './pages/account/SettingsPage'
import DeleteAccountPage  from './pages/account/DeleteAccountPage'
import BackupAccountPage  from './pages/account/BackupAccountPage'
import ChangePasswordPage from './pages/account/ChangePasswordPage'

import CreateAccountPage  from './pages/account/CreateAccountPage'
import RestoreAccountPage from './pages/account/RestoreAccountPage'

import NotFoundPage       from './pages/errors/NotFoundPage'

import AppPage            from './pages/apps/AppPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DashboardPage} />

    <Route path="profile/blockchain/:name"    component={ViewProfilePage} />
    <Route path="profile/local/:index"        component={ViewProfilePage} />
    <Route path="profile/local/:index/edit"   component={EditProfilePage} />
    <Route path="profile/local/:index/export" component={ExportPage} />

    <Route path="search/:query"       component={SearchPage} />

    <Route path="names/register"      component={RegisterPage} />
    <Route path="names/import"        component={ImportPage} />

    <Route path="account/deposit"     component={DepositPage} />
    <Route path="account/withdraw"    component={WithdrawPage} />
    <Route path="account/delete"      component={DeleteAccountPage} />
    <Route path="account/backup"      component={BackupAccountPage} />
    <Route path="account/password"    component={ChangePasswordPage} />
    <Route path="account/settings"    component={SettingsPage} />

    <Route path="account/create"      component={CreateAccountPage} />
    <Route path="account/restore"     component={RestoreAccountPage} />

    <Route path="app/:name" component={AppPage} />

    <Route path="*" component={NotFoundPage} />
  </Route>
)
