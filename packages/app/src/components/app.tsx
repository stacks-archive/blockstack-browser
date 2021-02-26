import React, { useEffect } from 'react';
import packageJson from '../../package.json';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { RecoilRoot } from 'recoil';
import { theme } from '@common/theme';
import { Routes } from '@components/routes';
import { HashRouter as Router } from 'react-router-dom';
import { useMessagePong } from '@common/hooks/use-message-pong';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from './drawer/accounts';
import { NetworksDrawer } from './drawer/networks-drawer';

export const App: React.FC = () => {
  useMessagePong();
  useEffect(() => {
    (window as any).__APP_VERSION__ = packageJson.version;
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <ColorModeProvider defaultMode="light">
          <>
            <GlobalStyles />
            <VaultLoader />
            <Router>
              <AccountsDrawer />
              <NetworksDrawer />
              <Routes />
            </Router>
          </>
        </ColorModeProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
