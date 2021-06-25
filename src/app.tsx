import React, { useEffect } from 'react';
import { ThemeProvider, ColorModeProvider } from '@stacks/ui';
import { Toaster } from 'react-hot-toast';

import { theme } from '@common/theme';
import { HashRouter as Router } from 'react-router-dom';
import { GlobalStyles } from '@components/global-styles';
import { VaultLoader } from '@components/vault-loader';
import { AccountsDrawer } from '@features/accounts-drawer/accounts-drawer';
import { NetworksDrawer } from '@features/network-drawer/networks-drawer';
import { Routes } from './routes';
import { Devtools } from '@features/devtool/devtools';
import { SettingsPopover } from '@features/settings-dropdown/settings-popover';

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
