import React, { useEffect } from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { Toaster } from 'react-hot-toast';
import { RecoilRoot } from 'recoil';
import packageJson from '../package.json';

import { theme } from '@common/theme';
import { HashRouter as Router } from 'react-router-dom';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from './components/drawer/accounts';
import { NetworksDrawer } from './components/drawer/networks-drawer';
import { DebugObserver } from '@components/debug-observer';
import { Routes } from './routes';

export const App: React.FC = () => {
  useEffect(() => {
    (window as any).__APP_VERSION__ = packageJson.version;
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <DebugObserver />
        <ColorModeProvider defaultMode="light">
          <>
            <GlobalStyles />
            <VaultLoader />
            <Router>
              <AccountsDrawer />
              <NetworksDrawer />
              <Routes />
            </Router>
            <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
          </>
        </ColorModeProvider>
      </RecoilRoot>
    </ThemeProvider>
  );
};

export default App;
