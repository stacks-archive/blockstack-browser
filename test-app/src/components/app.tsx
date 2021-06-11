import React from 'react';
import { ThemeProvider, theme, Flex, ColorModeProvider } from '@stacks/ui';
import { Connect } from '@stacks/connect-react';
import { AppContext } from '@common/context';
import { Header } from '@components/header';
import { Home } from '@components/home';

import { useAuth } from '@common/use-auth';
import { GlobalStyles } from '@components/global-styles';

export const App: React.FC = () => {
  const { authOptions, state, authResponse, appPrivateKey, handleSignOut } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider defaultMode="light">
        <GlobalStyles />
        <Connect authOptions={authOptions}>
          <AppContext.Provider value={state}>
            <Flex width="100%" flexDirection="column" minHeight="100vh" bg="white">
              {/*These are for tests*/}
              {authResponse && <input type="hidden" id="auth-response" value={authResponse} />}
              {appPrivateKey && <input type="hidden" id="app-private-key" value={appPrivateKey} />}
              <Header signOut={handleSignOut} />
              <Home />
            </Flex>
          </AppContext.Provider>
        </Connect>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
