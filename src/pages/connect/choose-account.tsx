import React, { useCallback, useEffect } from 'react';
import { Screen, ScreenBody } from '@screen';
import { Title } from '@components/typography';
import { Box } from '@stacks/ui';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { ReuseAppDrawer } from '@components/drawer/reuse-app-drawer';
import { gaiaUrl } from '@common/constants';
import { ScreenPaths } from '@store/common/types';
import { useWallet } from '@common/hooks/use-wallet';
import { Navigate } from '@components/navigate';
import { isValidUrl } from '@common/validate-url';
import {
  createWalletGaiaConfig,
  updateWalletConfig,
  WalletConfig,
  ConfigApp,
} from '@stacks/wallet-sdk';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Header } from '@components/header';
import { useAppDetails } from '@common/hooks/useAppDetails';

interface ChooseAccountProps {
  next: (accountIndex: number) => void;
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = ({ next }) => {
  const { name: appName } = useAppDetails();
  const { wallet, walletConfig } = useWallet();
  const [reusedApps, setReusedApps] = React.useState<ConfigApp[]>([]);
  const { decodedAuthRequest: authRequest } = useOnboardingState();
  const [accountIndex, setAccountIndex] = React.useState<number | undefined>();
  const { handleCancelAuthentication } = useWallet();

  if (!wallet) {
    return <Navigate to={{ pathname: '/', hash: 'sign-up' }} screenPath={ScreenPaths.GENERATION} />;
  }

  const handleUnmount = useCallback(async () => {
    handleCancelAuthentication();
  }, [handleCancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  // TODO: refactor into util, create unit tests
  const didSelectAccount = ({ accountIndex }: { accountIndex: number }) => {
    setAccountIndex(accountIndex);
    if (!authRequest) {
      console.error('No authRequest found when selecting account');
      return;
    }
    if (
      walletConfig.state === 'hasValue' &&
      walletConfig.contents &&
      !walletConfig.contents.meta?.hideWarningForReusingIdentity &&
      authRequest.scopes.includes('publish_data')
    ) {
      if (!isValidUrl(authRequest.redirect_uri)) {
        throw new Error('Cannot proceed with malformed url');
      }
      const url = new URL(authRequest.redirect_uri);
      const apps = walletConfig.contents.accounts[accountIndex]?.apps;
      if (apps) {
        let newReusedApps: ConfigApp[] = [];
        let hasLoggedInWithThisID = false;
        Object.keys(apps).forEach(origin => {
          const app = apps[origin];
          if (origin !== url.origin && app.scopes.includes('publish_data')) {
            newReusedApps.push(app);
          } else if (origin === url.origin && app.scopes.includes('publish_data')) {
            hasLoggedInWithThisID = true;
          }
        });
        if (hasLoggedInWithThisID) {
          newReusedApps = [];
        }
        setReusedApps(newReusedApps);
      }
    }
    next(accountIndex);
  };

  return (
    <Box flexGrow={1} position="relative">
      <ReuseAppDrawer
        onClose={() => {
          setAccountIndex(undefined);
          setTimeout(() => setReusedApps([]), 250);
        }}
        isShowing={reusedApps.length > 0}
        apps={reusedApps}
        confirm={async (hideWarning: boolean) => {
          if (hideWarning && walletConfig.value) {
            const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
            const newConfig: WalletConfig = {
              ...walletConfig.value,
              meta: {
                hideWarningForReusingIdentity: true,
              },
            };
            await updateWalletConfig({ wallet, walletConfig: newConfig, gaiaHubConfig });
          }
          next(accountIndex as number);
        }}
      />
      <Screen textAlign="center">
        <Header hideActions />
        <AppIcon mt={10} mb={4} size="72px" />
        <ScreenBody
          body={[
            <Title fontSize={4} pb={2}>
              Choose an account
            </Title>,
            `to sign in to ${appName}`,
            <Accounts
              mt="loose"
              accountIndex={accountIndex}
              next={(accountIndex: number) => didSelectAccount({ accountIndex })}
            />,
          ]}
        />
      </Screen>
    </Box>
  );
};
