import React from 'react';
import { Screen, ScreenBody, ScreenHeader } from '@screen';
import { Title } from '@components/typography';
import { Box } from '@stacks/ui';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { ReuseAppDrawer } from '@components/drawer/reuse-app-drawer';
import { gaiaUrl } from '@common/constants';
import {
  CHOOSE_ACCOUNT_CHOSEN,
  CHOOSE_ACCOUNT_REUSE_WARNING,
  CHOOSE_ACCOUNT_REUSE_WARNING_BACK,
  CHOOSE_ACCOUNT_REUSE_WARNING_CONTINUE,
  CHOOSE_ACCOUNT_REUSE_WARNING_DISABLED,
} from '@common/track';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
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

interface ChooseAccountProps {
  next: (accountIndex: number) => void;
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = ({ next }) => {
  const { appName } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
  }));
  const { wallet, walletConfig } = useWallet();
  const [reusedApps, setReusedApps] = React.useState<ConfigApp[]>([]);
  const { decodedAuthRequest: authRequest } = useOnboardingState();
  const [accountIndex, setAccountIndex] = React.useState<number | undefined>();
  const { doTrack } = useAnalytics();

  if (!wallet) {
    return <Navigate to={{ pathname: '/', hash: 'sign-up' }} screenPath={ScreenPaths.GENERATION} />;
  }

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
        if (Object.keys(newReusedApps).length > 0) {
          doTrack(CHOOSE_ACCOUNT_REUSE_WARNING);
          return;
        }
      }
    }
    doTrack(CHOOSE_ACCOUNT_CHOSEN);
    next(accountIndex);
  };

  return (
    <Box flexGrow={1} position="relative">
      <ReuseAppDrawer
        close={() => {
          setAccountIndex(undefined);
          doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_BACK);
          setTimeout(() => setReusedApps([]), 250);
        }}
        showing={reusedApps.length > 0}
        apps={reusedApps}
        confirm={async (hideWarning: boolean) => {
          if (hideWarning && walletConfig.value) {
            doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_DISABLED);
            const gaiaHubConfig = await createWalletGaiaConfig({ wallet, gaiaHubUrl: gaiaUrl });
            const newConfig: WalletConfig = {
              ...walletConfig.value,
              meta: {
                hideWarningForReusingIdentity: true,
              },
            };
            await updateWalletConfig({ wallet, walletConfig: newConfig, gaiaHubConfig });
          }
          doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_CONTINUE);
          next(accountIndex as number);
        }}
      />
      <Screen textAlign="center">
        <ScreenHeader title="Continue with Secret Key" />
        <AppIcon mt={10} mb={4} size="72px" />
        <ScreenBody
          body={[
            <Title pb={2}>Choose an account</Title>,
            `to use with ${appName}`,
            <Accounts
              accountIndex={accountIndex}
              next={(accountIndex: number) => didSelectAccount({ accountIndex })}
            />,
          ]}
        />
      </Screen>
    </Box>
  );
};
