const selectApi = state => state.settings.api

const selectStorageConnected = state => state.settings.api.storageConnected

const selectCoreHost = state => state.settings.api.coreHost

const selectCorePort = state => state.settings.api.corePort

const selectCoreAPIPassword = state => state.settings.api.coreAPIPassword

export {
  selectApi,
  selectStorageConnected,
  selectCoreHost,
  selectCorePort,
  selectCoreAPIPassword
}
