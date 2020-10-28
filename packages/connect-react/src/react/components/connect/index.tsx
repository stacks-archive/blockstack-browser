import React from 'react';
import { ConnectProvider } from './context';
import { AuthOptions } from '@stacks/connect';

/**
 * Usage
 *
 *
 * const auth = {
      manifestPath: '/static/manifest.json',
      redirectTo: '/',
      finished: ({userSession}) => {
        doFinishSignIn();
      },
      authOrigin,
      appDetails: {
        name: 'Wink',
        icon: 'url'
      }
    }
 *
 * <Connect authOptions={authOptions} />
 */
const Connect = ({ authOptions, children }: { authOptions: AuthOptions; children: any }) => {
  return <ConnectProvider authOptions={authOptions}>{children}</ConnectProvider>;
};

export { Connect };
