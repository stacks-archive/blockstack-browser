const selectAppManifestLoaded = ({ auth }) => auth.appManifestLoaded
const selectAppManifestLoading = ({ auth }) => auth.appManifestLoading
const selectAppManifestLoadingError = ({ auth }) => auth.appManifestLoadingError
const selectCoreSessionTokens = ({ auth }) => auth.coreSessionTokens
const selectLoggedIntoApp = ({ auth }) => auth.loggedIntoApp
const selectAppManifest = ({ auth }) => auth.appManifest
const selectAppName = ({ auth }) => auth.appManifest && auth.appManifest.name
const selectAppDescription = ({ auth }) =>
  auth.appManifest && auth.appManifest.description
const selectAppThemeColor = ({ auth }) =>
  auth.appManifest && auth.appManifest.theme_color
const selectAppBackgroundColor = ({ auth }) =>
  auth.appManifest && auth.appManifest.background_color
const selectAppStartUrl = ({ auth }) =>
  auth.appManifest && auth.appManifest.start_url
const selectAppIcons = ({ auth }) => auth.appManifest && auth.appManifest.icons
const selectAuthRequest = ({ auth }) => auth && auth.authRequest
export {
  selectAppManifest,
  selectAppManifestLoaded,
  selectAppManifestLoading,
  selectAppManifestLoadingError,
  selectCoreSessionTokens,
  selectAuthRequest,
  selectLoggedIntoApp,
  selectAppName,
  selectAppDescription,
  selectAppThemeColor,
  selectAppBackgroundColor,
  selectAppStartUrl,
  selectAppIcons
}
