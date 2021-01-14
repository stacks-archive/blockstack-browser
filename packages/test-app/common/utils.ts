import { RPCClient } from '@stacks/rpc-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getAuthOrigin = () => {
  if (location.port === '3001') {
    return 'http://localhost:8081';
  }
  const authOrigin = process.env.AUTH_ORIGIN || 'http://localhost:8080';
  return authOrigin;
};

export const getRPCClient = () => {
  const { origin } = location;
  const url = origin.includes('localhost')
    ? 'http://localhost:3999'
    : 'https://stacks-node-api.testnet.stacks.co';
  return new RPCClient(url);
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);
