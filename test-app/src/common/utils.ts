import { RPCClient } from '@stacks/rpc-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StacksTestnet } from '@stacks/network';

dayjs.extend(relativeTime);

let coreApiUrl = 'https://stacks-node-api.stacks.co';

export const getRPCClient = () => {
  return new RPCClient(coreApiUrl);
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);

export const stacksNetwork = new StacksTestnet();
stacksNetwork.coreApiUrl = coreApiUrl;
