import React from 'react'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'

import App from './App'
import HomeScreenPage from './HomeScreenPage'
import UpdateStatePage from './update'

import ProfilesApp from './profiles/ProfilesApp'
import RegistrationPage from './profiles/RegistrationPage'
import RegistrationSearchView from './profiles/components/registration/RegistrationSearchView'
import RegistrationSelectView from './profiles/components/registration/RegistrationSelectView'
import RegistrationSubmittedView from './profiles/components/registration/RegistrationSubmittedView'
import DefaultProfilePage from './profiles/DefaultProfilePage'
import AllProfilesPage from './profiles/AllProfilesPage'
import ViewProfilePage from './profiles/ViewProfilePage'
import EditProfilePage from './profiles/EditProfilePage'
import RegisterProfilePage from './profiles/RegisterProfilePage'
import ImportProfilePage from './profiles/ImportProfilePage'
import ExportProfilePage from './profiles/ExportProfilePage'
import SearchProfilesPage from './profiles/SearchProfilesPage'
import TransferNamePage from './profiles/TransferNamePage'
import ZoneFilePage from './profiles/ZoneFilePage'

import AccountApp from './account/AccountApp'
import AccountMenu from './account/AccountMenu'
import DeleteAccountPage from './account/DeleteAccountPage'
import BackupAccountPage from './account/BackupAccountPage'
import ChangePasswordPage from './account/ChangePasswordPage'
import CreateAccountPage from './account/CreateAccountPage'
import ApiSettingsPage from './account/ApiSettingsPage'
import StorageProvidersPage from './account/StorageProvidersPage'

import WalletApp from './wallet/WalletApp'
import ReceivePage from './wallet/ReceivePage'
import SendPage from './wallet/SendPage'
import SendCorePage from './wallet/SendCorePage'

import NewAuthPage from './auth'
import ClearAuthPage from './clear-auth'

import SignUpPage from './sign-up'
import SeedPage from './seed'
import SignInPage from './sign-in'

import ConnectStoragePage from './connect-storage'

import NotFoundPage from './errors/NotFoundPage'

import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

const accountCreated = connectedRouterRedirect({
  redirectPath: state =>
    !state.account.encryptedBackupPhrase ?
      // Not signed in
      '/sign-up' :
      // Storage failed to connect
      '/connect-storage',
  authenticatedSelector: state =>
    // Not signed in
    !!state.account.encryptedBackupPhrase &&
    // Storage failed to connect
    !!state.settings.api.storageConnected,
  wrapperDisplayName: 'AccountCreated'
})

export default (
  <Router history={browserHistory}>
    <Route path="/" component={accountCreated(App)}>
      <IndexRoute component={HomeScreenPage} />
      <Route path="profiles" component={ProfilesApp}>
        <IndexRoute component={DefaultProfilePage} />
        <Route path="i/all" component={AllProfilesPage} />
        <Route path="i/search/:query" component={SearchProfilesPage} />
        <Route path=":name" component={ViewProfilePage} />
        <Route path=":index/local" component={ViewProfilePage} />
        <Route path=":index/edit" component={EditProfilePage} />
        <Route path=":index/transfer-name" component={TransferNamePage} />
        <Route path=":index/zone-file" component={ZoneFilePage} />
        <Route path=":index/export" component={ExportProfilePage} />
        <Route path="i/add-username" component={RegistrationPage}>
          <Route path=":index/search" component={RegistrationSearchView} />
          <Route
            path=":index/select/:name"
            component={RegistrationSelectView}
          />
          <Route
            path=":index/submitted/:name"
            component={RegistrationSubmittedView}
          />
        </Route>
        <Route path="i/register/:index" component={RegisterProfilePage} />
        <Route path="i/import" component={ImportProfilePage} />
      </Route>

      <Route path="account" component={AccountApp}>
        <IndexRoute component={AccountMenu} />
        <Route path="delete" component={DeleteAccountPage} />
        <Route path="backup" component={BackupAccountPage} />
        <Route path="password" component={ChangePasswordPage} />
        <Route path="create" component={CreateAccountPage} />
        <Route path="api" component={ApiSettingsPage} />
        <Route path="storage" component={StorageProvidersPage} />
      </Route>

      <Route path="wallet" component={WalletApp}>
        <Route path="receive" component={ReceivePage} />
        <Route path="send" component={SendPage} />
        <Route path="send-core" component={SendCorePage} />
      </Route>

      <Route path="/auth" component={NewAuthPage} />
    </Route>
    <Route path="/sign-up" component={SignUpPage} />
    <Route path="/sign-up/*" component={SignUpPage} />
    {/**
     * TODO: move /update back up ^^, had to move it out of the 'app' nested route
     * because when we wipe data, it wants to redirect to /sign-up
     */}
    <Route path="/update" component={UpdateStatePage} />
    <Route path="/sign-in" component={SignInPage} />
    <Route path="/sign-in/*" component={SignInPage} />
    <Route path="/seed" component={SeedPage} />
    <Route path="/connect-storage" component={ConnectStoragePage} />
    <Route path="/clear-auth" component={ClearAuthPage} />
    <Route path="/*" component={NotFoundPage} />
  </Router>
)
