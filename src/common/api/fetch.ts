export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const defaultHeaders = new Headers([['x-stx-extension-version', VERSION]]);

export const fetchFromSidecar = (apiServer: string) => async (path: string, opts = {}) => {
  const url = withApiServer(apiServer)('/extended/v1' + path);
  const response = await fetch(url, { ...opts, headers: defaultHeaders });
  if (!response.ok) throw new Error(`Unable to fetch API data from ${url}`);
  return response.json();
};
