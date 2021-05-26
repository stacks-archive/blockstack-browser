import { fetcher } from '@common/api/wrapped-fetch';

export async function fetchNamesByAddress(networkUrl: string, address: string): Promise<string[]> {
  const res = await fetcher(networkUrl + `/v1/addresses/stacks/${address}`);
  const data = await res.json();
  return data?.names || [];
}
