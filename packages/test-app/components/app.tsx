import React from 'react';

import { ThemeProvider, Box, theme, Text, Flex, CSSReset, Button, Stack } from '@blockstack/ui';
import { Connect, AuthOptions, useConnect } from '@blockstack/connect';
import { UserSession, AppConfig } from 'blockstack';

const icon = '/assets/messenger-app-icon.png';
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
  authOrigin = 'https://app.blockstack.org';
}

const Card: React.FC = props => (
  <Flex
    border="1px solid"
    borderRadius="6px"
    borderColor="inherit"
    p={6}
    direction="column"
    boxShadow="mid"
    minWidth="420px"
    {...props}
  />
);

const AppContent: React.FC = () => {
  const { doOpenAuth, doAuth } = useConnect();

  return (
    <Card>
      <Box textAlign="center" pb={6}>
        <Text as="h1">Blockstack Connect</Text>
      </Box>
      <Flex justify="center">
        <Stack isInline>
          <Button onClick={() => doOpenAuth(false)} data-test="sign-up">
            Sign Up
          </Button>
          <Button onClick={() => doOpenAuth(true)} data-test="sign-in">
            Sign In
          </Button>
          <Button onClick={() => doAuth()} data-test="skip-connect">
            Skip Connect
          </Button>
        </Stack>
      </Flex>
    </Card>
  );
};

interface AppState {
  [key: string]: any;
}

const SignedIn = (props: { username: string; handleSignOut: () => void }) => {
  return (
    <Card>
      <Box textAlign="center">
        <Text as="h1">Welcome back!</Text>
      </Box>
      <Box textAlign="center" pt={4}>
        <Text as="h2">{props.username}</Text>
      </Box>
      <Flex mt={6} align="center" justify="center">
        <Button mx="auto" onClick={props.handleSignOut}>
          Sign out
        </Button>
      </Flex>
    </Card>
  );
};

export const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>({});
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = new AppConfig();
  const userSession = new UserSession({ appConfig });

  const handleRedirectAuth = async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState(() => userData);
    }
  };

  React.useEffect(() => {
    void handleRedirectAuth();
  }, []);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    finished: ({ userSession, authResponse }) => {
      const userData = userSession.loadUserData();
      setState(() => userData);
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      console.log(userData);
    },
    onCancel: () => {
      console.log('popup closed!');
    },
    authOrigin,
    appDetails: {
      name: 'Testing App',
      icon,
    },
  };

  const handleSignOut = () => {
    setState({});
  };
  const isSignedIn = (state && state.identityAddress) || undefined;
  return (
    <Connect authOptions={authOptions}>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <Flex
          direction="column"
          height="100vh"
          width="100vw"
          align="center"
          justify="center"
          bg="whitesmoke"
        >
          {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
          {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

          {!isSignedIn ? (
            <AppContent />
          ) : (
            <SignedIn handleSignOut={handleSignOut} username={state.username} />
          )}
        </Flex>
      </ThemeProvider>
    </Connect>
  );
};
