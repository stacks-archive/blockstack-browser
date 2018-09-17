import React from 'react'
import { browserHistory, IndexRoute, Route, Router } from 'react-router'
import Loadable from 'react-loadable'
import App from './App'
import ClearAuthPage from './clear-auth'
import ConnectStoragePage from './connect-storage'
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
  loader: () => import('./HomeScreenPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const ProfilesApp = Loadable({
  loader: () =>
    import('./profiles/ProfilesApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const UpdateStatePage = Loadable({
  loader: () =>
    import('./update'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationPage = Loadable({
  loader: () =>
    import('./profiles/RegistrationPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationSearchView = Loadable({
  loader: () =>
    import('./profiles/components/registration/RegistrationSearchView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const RegistrationSelectView = Loadable({
  loader: () =>
    import('./profiles/components/registration/RegistrationSelectView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegistrationSubmittedView = Loadable({
  loader: () =>
    import( './profiles/components/registration/RegistrationSubmittedView'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const DefaultProfilePage = Loadable({
  loader: () =>
    import('./profiles/DefaultProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const AllProfilesPage = Loadable({
  loader: () =>
    import('./profiles/AllProfilesPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const RegisterProfilePage = Loadable({
  loader: () =>
    import('./profiles/RegisterProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ImportProfilePage = Loadable({
  loader: () =>
    import('./profiles/ImportProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ExportProfilePage = Loadable({
  loader: () =>
    import('./profiles/ExportProfilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SearchProfilesPage = Loadable({
  loader: () =>
    import( './profiles/SearchProfilesPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const TransferNamePage = Loadable({
  loader: () =>
    import('./profiles/TransferNamePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ZoneFilePage = Loadable({
  loader: () =>
    import( './profiles/ZoneFilePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const AccountApp = Loadable({
  loader: () =>
    import( './account/AccountApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const AccountMenu = Loadable({
  loader: () =>
    import( './account/AccountMenu'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const DeleteAccountPage = Loadable({
  loader: () =>
    import( './account/DeleteAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const BackupAccountPage = Loadable({
  loader: () =>
    import( './account/BackupAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ChangePasswordPage = Loadable({
  loader: () =>
    import( './account/ChangePasswordPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const CreateAccountPage = Loadable({
  loader: () =>
    import( './account/CreateAccountPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ApiSettingsPage = Loadable({
  loader: () =>
    import('./account/ApiSettingsPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const StorageProvidersPage = Loadable({
  loader: () =>
    import( './account/StorageProvidersPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const WalletApp = Loadable({
  loader: () =>
    import('./wallet/WalletApp'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const ReceivePage = Loadable({
  loader: () =>
    import('./wallet/ReceivePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SendPage = Loadable({
  loader: () => import('./wallet/SendPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SendCorePage = Loadable({
  loader: () =>
    import('./wallet/SendCorePage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const NewAuthPage = Loadable({
  loader: () => import('./auth/index'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const SignUpPage = Loadable({
  loader: () => import( './sign-up'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SeedPage = Loadable({
  loader: () => import( './seed'),
  loading: Loading,
  delay: LOADABLE_DELAY
})
const SignInPage = Loadable({
  loader: () => import( './sign-in'),
  loading: Loading,
  delay: LOADABLE_DELAY
})

const NotFoundPage = Loadable({
  loader: () =>
    import( './errors/NotFoundPage'),
  loading: Loading,
  delay: LOADABLE_DELAY
})


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
  <Router history={ browserHistory }>
    <Route path="/" component={ accountCreated(App) }>
      <IndexRoute component={ HomeScreenPage }/>
      <Route path="profiles" component={ ProfilesApp }>
        <IndexRoute component={ DefaultProfilePage }/>
        <Route path="i/all" component={ AllProfilesPage }/>
        <Route path="i/search/:query" component={ SearchProfilesPage }/>
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
    <Route path="/connect-storage" component={ ConnectStoragePage }/>
    <Route path="/clear-auth" component={ ClearAuthPage }/>
    <Route path="/*" component={ NotFoundPage }/>
  </Router>
)
