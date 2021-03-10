import { RPCClient } from '@stacks/rpc-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StacksTestnet } from '@stacks/network';

dayjs.extend(relativeTime);

export const getAuthOrigin = () => {
  if (location.port === '3001') {
    return 'http://localhost:8081';
  }
  const authOrigin = process.env.AUTH_ORIGIN || 'http://localhost:8080';
  return authOrigin;
};

let coreApiUrl = 'https://stacks-node-api.xenon.blockstack.org';
if (location.origin.includes('localhost')) {
  coreApiUrl = 'http://localhost:3999';
}

export const getRPCClient = () => {
  return new RPCClient(coreApiUrl);
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);

export const stacksNetwork = new StacksTestnet();
stacksNetwork.coreApiUrl = coreApiUrl;
