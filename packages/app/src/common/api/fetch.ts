export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const fetchFromApi = (apiServer: string) => async (path: string, opts = {}) =>
  fetch(withApiServer(apiServer)(path), opts);

export const fetchFromSidecar = (apiServer: string) => async (path: string, opts = {}) =>
  fetch(withApiServer(apiServer)('/extended/v1' + path), opts);

export const postToApi = (apiServer: string) => async (path: string, opts = {}) =>
  fetchFromApi(apiServer)(path, { method: 'POST', ...opts });

export const postToSidecar = (apiServer: string) => async (path: string, opts = {}) =>
  fetchFromSidecar(apiServer)(path, { method: 'POST', ...opts });
