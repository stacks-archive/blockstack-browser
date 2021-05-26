import { fetcher } from '@common/api/wrapped-fetch';

export const withApiServer = (apiServer: string) => (path?: string) =>
  path ? apiServer + path : apiServer;

export const fetchFromSidecar =
  (apiServer: string) =>
  async (path: string, opts = {}) => {
    const url = withApiServer(apiServer)('/extended/v1' + path);
    const response = await fetcher(url, { ...opts });
    if (!response.ok) throw new Error(`Unable to fetch API data from ${url}`);
    return response.json();
  };
