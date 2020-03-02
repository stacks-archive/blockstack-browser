import * as React from 'react';

import { ThemeProvider, theme, Flex, CSSReset, Button, Stack } from '@blockstack/ui';
import { Connect, AuthOptions, useConnect } from '@blockstack/connect';

const icon = `${document.location.href}/assets/messenger-app-icon.png`;
const authOptions: AuthOptions = {
  manifestPath: '/static/manifest.json',
  redirectTo: '/',
  finished: ({ userSession }) => {
    console.log(userSession.loadUserData());
  },
  authOrigin: 'http://localhost:8080',
  appDetails: {
    name: 'Testing App',
    icon,
  },
};

const AppContent: React.FC = () => {
  const { doOpenAuth } = useConnect();
  return (
    <Stack isInline>
      <Button onClick={() => doOpenAuth(false)}>Open Connect</Button>
      <Button onClick={() => doOpenAuth(true)}>Sign In</Button>
    </Stack>
  );
};

export const App: React.FC = () => (
  <Connect authOptions={authOptions}>
    <ThemeProvider theme={theme}>
      <CSSReset />
      <Flex direction="column" height="100vh" width="100vw" align="center" justify="center">
        <AppContent />
      </Flex>
    </ThemeProvider>
  </Connect>
);
