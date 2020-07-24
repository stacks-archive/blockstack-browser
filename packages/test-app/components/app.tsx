import React, { useEffect } from 'react';
import { ThemeProvider, theme, Flex, CSSReset } from '@blockstack/ui';
import { Connect, AuthOptions } from '@blockstack/connect';
import { getAuthOrigin } from '@common/utils';
import { UserSession, AppConfig } from 'blockstack';
import { defaultState, AppContext, AppState } from '@common/context';
import { Header } from '@components/header';
import { Home } from '@components/home';

const icon = '/assets/messenger-app-icon.png';
export const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>(defaultState());
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = new AppConfig(['store_write', 'publish_data'], document.location.href);
  const userSession = new UserSession({ appConfig });

  const signOut = () => {
    userSession.signUserOut();
    setState({ userData: null });
  };

  const authOrigin = getAuthOrigin();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setState({ userData });
    }
  }, []);

  const handleRedirectAuth = async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({ userData });
    }
  };

  React.useEffect(() => {
    void handleRedirectAuth();
  }, []);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    userSession,
    finished: ({ userSession, authResponse }) => {
      const userData = userSession.loadUserData();
      // setState(() => userData);
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      setState({ userData });
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

  return (
    <Connect authOptions={authOptions}>
      <ThemeProvider theme={theme}>
        <AppContext.Provider value={state}>
          <CSSReset />
          <Flex direction="column" minHeight="100vh" bg="white">
            {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
            {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}

            <Header signOut={signOut} />

            <Home />
          </Flex>
        </AppContext.Provider>
      </ThemeProvider>
    </Connect>
  );
};
