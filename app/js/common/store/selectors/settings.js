const selectApi = ({ settings }) => settings.api

const selectStorageConnected = ({ settings }) =>
  settings.api && settings.api.storageConnected

export { selectApi, selectStorageConnected }
