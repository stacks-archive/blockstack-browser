import React, { useEffect } from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { Toaster } from 'react-hot-toast';

import { theme } from '@common/theme';
import { HashRouter as Router } from 'react-router-dom';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from '@components/drawer/accounts';
import { NetworksDrawer } from '@components/drawer/networks-drawer';
import { Routes } from './routes';
import { Devtools } from '@components/devtools';
import { SettingsPopover } from '@components/popup/settings-popover';

export const App: React.FC = () => {
  useEffect(() => {
    (window as any).__APP_VERSION__ = VERSION;
  }, []);
  return (
    <>
      <Devtools />
      <ThemeProvider theme={theme}>
        <ColorModeProvider defaultMode="light">
          <>
            <GlobalStyles />
            <VaultLoader />
            <Router>
              <Routes />
              <AccountsDrawer />
              <NetworksDrawer />
              <SettingsPopover />
            </Router>
            <Toaster position="bottom-center" toastOptions={{ style: { fontSize: '14px' } }} />
          </>
        </ColorModeProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
