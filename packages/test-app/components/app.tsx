import React from 'react';

import { ThemeProvider, theme, Flex, CSSReset, Button, Stack } from '@blockstack/ui';
import { Connect, AuthOptions, useConnect } from '@blockstack/connect';

const icon = `${document.location.href}/assets/messenger-app-icon.png`;
let authOrigin = 'http://localhost:8080';
// In order to have deploy previews use the same version of the authenticator,
// we detect if this is a 'deploy preview' and change the origin to point to the
// same PR's deploy preview in the authenticator.
if (document.location.origin.includes('deploy-preview')) {
  // Our netlify sites are called "authenticator-demo" for this app, and
  // "stacks-authenticator" for the authenticator.
  authOrigin = document.location.origin.replace('authenticator-demo', 'stacks-authenticator');
}

const AppContent: React.FC = () => {
  const { doOpenAuth, doAuth } = useConnect();

  return (
    <Stack isInline>
      <Button onClick={() => doOpenAuth(false)}>Open Connect</Button>
      <Button onClick={() => doOpenAuth(true)}>Sign In</Button>
      <Button onClick={() => doAuth()} data-test="button-skip-connect">
        Skip Connect
      </Button>
    </Stack>
  );
};

export const App: React.FC = () => {
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    finished: ({ userSession, authResponse }) => {
      console.log(userSession.loadUserData());
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
    },
    authOrigin,
    appDetails: {
      name: 'Testing App',
      icon,
    },
  };

  return (
    <Connect authOptions={authOptions}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Flex direction="column" height="100vh" width="100vw" align="center" justify="center">
          {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
          {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}
          <AppContent />
        </Flex>
      </ThemeProvider>
    </Connect>
  );
};
