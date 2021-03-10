import React, {useEffect} from 'react';
import {ThemeProvider, theme, Flex, ColorModeProvider} from '@stacks/ui';
import {Connect} from '@stacks/connect-react';
import {AuthOptions} from '@stacks/connect';
import {getAuthOrigin} from '@common/utils';
import {UserSession, AppConfig} from '@stacks/auth';
import {defaultState, AppContext, AppState} from '@common/context';
import {Header} from '@components/header';
import {Home} from '@components/home';
import {GlobalStyles} from "../../../src/components/global-styles";

const icon = '/assets/messenger-app-icon.png';
export const App: React.FC = () => {
  const [state, setState] = React.useState<AppState>(defaultState());
  const [authResponse, setAuthResponse] = React.useState('');
  const [appPrivateKey, setAppPrivateKey] = React.useState('');

  const appConfig = new AppConfig(['store_write', 'publish_data'], document.location.href);
  const userSession = new UserSession({appConfig});

  const signOut = () => {
    userSession.signUserOut();
    setState({userData: null});
  };

  const authOrigin = getAuthOrigin();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setState({userData});
    }
  }, []);

  const handleRedirectAuth = async () => {
    if (userSession.isSignInPending()) {
      const userData = await userSession.handlePendingSignIn();
      setState({userData});
      setAppPrivateKey(userData.appPrivateKey);
    } else if (userSession.isUserSignedIn()) {
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
    }
  };

  React.useEffect(() => {
    void handleRedirectAuth();
  }, []);

  const authOptions: AuthOptions = {
    manifestPath: '/static/manifest.json',
    redirectTo: '/',
    userSession,
    finished: ({userSession, authResponse}) => {
      const userData = userSession.loadUserData();
      setAppPrivateKey(userSession.loadUserData().appPrivateKey);
      setAuthResponse(authResponse);
      setState({userData});
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
    <ThemeProvider theme={theme}>
      <ColorModeProvider defaultMode="light">
        <GlobalStyles/>
        <Connect authOptions={authOptions}>
          <AppContext.Provider value={state}>
            <Flex flexDirection="column" minHeight="100vh" bg="white">
              {authResponse && <input type="hidden" id="auth-response" value={authResponse}/>}
              {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey}/>}
              <Header signOut={signOut}/>
              <Home/>
            </Flex>
          </AppContext.Provider>
        </Connect>
      </ColorModeProvider>
    </ThemeProvider>

  );
};
