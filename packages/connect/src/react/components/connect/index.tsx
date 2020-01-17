import React from 'react';
import { ConnectProvider } from './context';
import { Modal } from '../modal';
import { AuthOptions } from '../../../auth';

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
      vaultUrl,
      appDetails: {
        name: 'Wink',
        icon: 'url'
      }
    }
 *
 * <Connect authOptions={authOptions} />
 */
const Connect = ({ authOptions, children }: { authOptions: AuthOptions; children: any }) => {
  return (
    <ConnectProvider authOptions={authOptions}>
      <Modal />
      {children}
    </ConnectProvider>
  );
};

export { Connect };
