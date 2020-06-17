import { RPCClient } from '@blockstack/rpc-client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getAuthOrigin = () => {
  let authOrigin = process.env.AUTH_ORIGIN || 'http://localhost:8080';
  // In order to have deploy previews use the same version of the authenticator,
  // we detect if this is a 'deploy preview' and change the origin to point to the
  // same PR's deploy preview in the authenticator.
  const { origin } = location;
  if (origin.includes('deploy-preview')) {
    // Our netlify sites are called "authenticator-demo" for this app, and
    // "stacks-authenticator" for the authenticator.
    authOrigin = document.location.origin.replace('authenticator-demo', 'stacks-authenticator');
  } else if (origin.includes('authenticator-demo')) {
    // TODO: revert this when 301 is merged
    authOrigin = 'https://deploy-preview-301--stacks-authenticator.netlify.app';
    // authOrigin = 'https://app.blockstack.org';
  }
  return authOrigin;
};

export const getRPCClient = () => {
  const { origin } = location;
  const url = origin.includes('localhost')
    ? 'http://localhost:3999'
    : 'https://sidecar.staging.blockstack.xyz';
  return new RPCClient(url);
};

export const toRelativeTime = (ts: number): string => dayjs().to(ts);
