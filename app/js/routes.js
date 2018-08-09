import React from 'react'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'
import Loadable from 'react-loadable'
import App from './App'
import ClearAuthPage from './clear-auth'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

const LOADABLE_DELAY = 300

const Loading = (props) => {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>
  } else if (props.pastDelay) {
    return <div style={ {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    } }>Loading...</div>
  }
  return null
}

const HomeScreenPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "HomeScreenPage" */ './HomeScreenPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const ProfilesApp = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ProfilesApp" */ './profiles/ProfilesApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const UpdateStatePage = Loadable({
  loader: () => import(/* webpackChunkName: "UpdateStatePage" */ './update'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "RegistrationPage" */ './profiles/RegistrationPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationSearchView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "RegistrationSearchView" */ './profiles/components/registration/RegistrationSearchView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const RegistrationSelectView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "RegistrationSelectView" */ './profiles/components/registration/RegistrationSelectView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationSubmittedView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "RegistrationSubmittedView" */ './profiles/components/registration/RegistrationSubmittedView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const DefaultProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "DefaultProfilePage" */ './profiles/DefaultProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const AllProfilesPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "AllProfilesPage" */ './profiles/AllProfilesPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ViewProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ViewProfilePage" */ './profiles/ViewProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const EditProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "EditProfilePage" */ './profiles/EditProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegisterProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "RegisterProfilePage" */ './profiles/RegisterProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ImportProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ImportProfilePage" */ './profiles/ImportProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ExportProfilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ExportProfilePage" */ './profiles/ExportProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SearchProfilesPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "SearchProfilesPage" */ './profiles/SearchProfilesPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const TransferNamePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "TransferNamePage" */ './profiles/TransferNamePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ZoneFilePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ZoneFilePage" */ './profiles/ZoneFilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const AccountApp = Loadable({
  loader: () =>
    import(/* webpackChunkName: "AccountApp" */ './account/AccountApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const AccountMenu = Loadable({
  loader: () =>
    import(/* webpackChunkName: "AccountMenu" */ './account/AccountMenu'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const DeleteAccountPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "DeleteAccountPage" */ './account/DeleteAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const BackupAccountPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "BackupAccountPage" */ './account/BackupAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ChangePasswordPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ChangePasswordPage" */ './account/ChangePasswordPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const CreateAccountPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "CreateAccountPage" */ './account/CreateAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ApiSettingsPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ApiSettingsPage" */ './account/ApiSettingsPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const StorageProvidersPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "StorageProvidersPage" */ './account/StorageProvidersPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const WalletApp = Loadable({
  loader: () =>
    import(/* webpackChunkName: "WalletApp" */ './wallet/WalletApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ReceivePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ReceivePage" */ './wallet/ReceivePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SendPage = Loadable({
  loader: () => import(/* webpackChunkName: "SendPage" */ './wallet/SendPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SendCorePage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "SendCorePage" */ './wallet/SendCorePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const NewAuthPage = Loadable({
  loader: () => import(/* webpackChunkName: "NewAuthPage" */ './auth/index'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const SignUpPage = Loadable({
  loader: () => import(/* webpackChunkName: "SignUpPage" */ './sign-up'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SeedPage = Loadable({
  loader: () => import(/* webpackChunkName: "SeedPage" */ './seed'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SignInPage = Loadable({
  loader: () => import(/* webpackChunkName: "SignInPage" */ './sign-in'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const NotFoundPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "NotFoundPage" */ './errors/NotFoundPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})


const accountCreated = connectedRouterRedirect({
  redirectPath: '/sign-up',
  authenticatedSelector: state => !!state.account.encryptedBackupPhrase,
  wrapperDisplayName: 'AccountCreated'
})

export default (
  <Router history={ browserHistory }>
    <Route path="/" component={ accountCreated(App) }>
      <IndexRoute component={ HomeScreenPage }/>
      <Route path="profiles" component={ ProfilesApp }>
        <IndexRoute component={ DefaultProfilePage }/>
        <Route path="i/all" component={ AllProfilesPage }/>
        <Route path="i/search/:query" component={ SearchProfilesPage }/>
        <Route path=":name" component={ ViewProfilePage }/>
        <Route path=":index/local" component={ ViewProfilePage }/>
        <Route path=":index/edit" component={ EditProfilePage }/>
        <Route path=":index/transfer-name" component={ TransferNamePage }/>
        <Route path=":index/zone-file" component={ ZoneFilePage }/>
        <Route path=":index/export" component={ ExportProfilePage }/>
        <Route path="i/add-username" component={ RegistrationPage }>
          <Route path=":index/search" component={ RegistrationSearchView }/>
          <Route
            path=":index/select/:name"
            component={ RegistrationSelectView }
          />
          <Route
            path=":index/submitted/:name"
            component={ RegistrationSubmittedView }
          />
        </Route>
        <Route path="i/register/:index" component={ RegisterProfilePage }/>
        <Route path="i/import" component={ ImportProfilePage }/>
      </Route>

      <Route path="account" component={ AccountApp }>
        <IndexRoute component={ AccountMenu }/>
        <Route path="delete" component={ DeleteAccountPage }/>
        <Route path="backup" component={ BackupAccountPage }/>
        <Route path="password" component={ ChangePasswordPage }/>
        <Route path="create" component={ CreateAccountPage }/>
        <Route path="api" component={ ApiSettingsPage }/>
        <Route path="storage" component={ StorageProvidersPage }/>
      </Route>

      <Route path="wallet" component={ WalletApp }>
        <Route path="receive" component={ ReceivePage }/>
        <Route path="send" component={ SendPage }/>
        <Route path="send-core" component={ SendCorePage }/>
      </Route>

      <Route path="/auth" component={ NewAuthPage }/>
    </Route>
    <Route path="/sign-up" component={ SignUpPage }/>
    <Route path="/sign-up/*" component={ SignUpPage }/>
    { /**
     * TODO: move /update back up ^^, had to move it out of the 'app' nested route
     * because when we wipe data, it wants to redirect to /sign-up
     */ }
    <Route path="/update" component={ UpdateStatePage }/>
    <Route path="/sign-in" component={ SignInPage }/>
    <Route path="/sign-in/*" component={ SignInPage }/>
    <Route path="/seed" component={ SeedPage }/>
    <Route path="/clear-auth" component={ ClearAuthPage }/>
    <Route path="/*" component={ NotFoundPage }/>
  </Router>
)
