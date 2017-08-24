import React                        from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

import App                  from './App'
import HomeScreenPage        from './HomeScreenPage'

import ProfilesApp          from './profiles/ProfilesApp'
import RegistrationPage      from './profiles/RegistrationPage'
import RegistrationSearchView  from './profiles/components/registration/RegistrationSearchView'
import RegistrationSelectView  from './profiles/components/registration/RegistrationSelectView'
import AllProfilesPage      from './profiles/AllProfilesPage'
import ViewProfilePage      from './profiles/ViewProfilePage'
import EditProfilePage      from './profiles/EditProfilePage'
import RegisterProfilePage  from './profiles/RegisterProfilePage'
import ImportProfilePage    from './profiles/ImportProfilePage'
import ExportProfilePage    from './profiles/ExportProfilePage'
import SearchProfilesPage   from './profiles/SearchProfilesPage'
import ZoneFilePage         from './profiles/ZoneFilePage'

import AccountApp           from './account/AccountApp'
import DeleteAccountPage    from './account/DeleteAccountPage'
import BackupAccountPage    from './account/BackupAccountPage'
import ChangePasswordPage   from './account/ChangePasswordPage'
import CreateAccountPage    from './account/CreateAccountPage'
import RestoreAccountPage   from './account/RestoreAccountPage'
import ApiSettingsPage      from './account/ApiSettingsPage'
import StorageProvidersPage from './account/StorageProvidersPage'

import WalletApp            from './wallet/WalletApp'
import ReceivePage          from './wallet/ReceivePage'
import SendPage             from './wallet/SendPage'

import AuthPage             from './auth/AuthPage'

import NotFoundPage         from './errors/NotFoundPage'

export default (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={HomeScreenPage} />

      <Route path="profiles" component={ProfilesApp}>
        <IndexRoute component={AllProfilesPage} />
        <Route path="i/search/:query" component={SearchProfilesPage} />
        <Route path=":name"           component={ViewProfilePage} />
        <Route path=":index/local"    component={ViewProfilePage} />
        <Route path=":index/edit"     component={EditProfilePage} />
        <Route path=":index/zone-file" component={ZoneFilePage} />
        <Route path=":index/export"   component={ExportProfilePage} />
        <Route path="i/add-username"  component={RegistrationPage} >
          <Route path=":index/search" component={RegistrationSearchView} />
          <Route path=":index/select/:name" component={RegistrationSelectView} />
        </Route>
        <Route path="i/register/:index" component={RegisterProfilePage} />
        <Route path="i/import"        component={ImportProfilePage} />
      </Route>

      <Route path="account" component={AccountApp}>
        <Route path="delete"      component={DeleteAccountPage} />
        <Route path="backup"      component={BackupAccountPage} />
        <Route path="password"    component={ChangePasswordPage} />
        <Route path="create"      component={CreateAccountPage} />
        <Route path="restore"     component={RestoreAccountPage} />
        <Route path="api"         component={ApiSettingsPage} />
        <Route path="storage"   component={StorageProvidersPage} />
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
