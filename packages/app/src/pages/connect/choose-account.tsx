import React from 'react';
import { PoweredBy, Screen, ScreenBody, ScreenFooter, Title } from '@blockstack/connect';
import { Box, PseudoBox, Text } from '@blockstack/ui';
import { ScreenHeader } from '@components/connected-screen-header';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { useSelector } from 'react-redux';
import { AppState, store } from '@store';
import { selectAppName, selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { Drawer } from '@components/drawer';
import { ConfigApp } from '@blockstack/keychain';
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

interface ChooseAccountProps {
  next: (identityIndex: number) => void;
  back?: () => void;
}

const SettingsButton = () => {
  const { doChangeScreen } = useAnalytics();
  return (
    <PseudoBox _hover={{ cursor: 'pointer' }} onClick={() => doChangeScreen(ScreenPaths.HOME)}>
      <Text color="blue" fontWeight={500} textStyle="body.small.medium" fontSize="12px">
        Settings
      </Text>
    </PseudoBox>
  );
};

export const ChooseAccount: React.FC<ChooseAccountProps> = ({ next }) => {
  const { appName } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
  }));
  const { wallet, identities } = useWallet();
  const [reusedApps, setReusedApps] = React.useState<ConfigApp[]>([]);
  const [identityIndex, setIdentityIndex] = React.useState<number | undefined>();
  const { doTrack } = useAnalytics();

  if (!wallet) {
    return <Navigate to={{ pathname: '/', hash: 'sign-up' }} screenPath={ScreenPaths.GENERATION} />;
  }

  // TODO: refactor into util, create unit tests
  const didSelectAccount = ({ identityIndex }: { identityIndex: number }) => {
    const state = store.getState();
    const authRequest = selectDecodedAuthRequest(state);
    setIdentityIndex(identityIndex);
    if (!authRequest) {
      console.error('No authRequest found when selecting account');
      return;
    }
    if (
      wallet.walletConfig &&
      !wallet.walletConfig.hideWarningForReusingIdentity &&
      authRequest.scopes.includes('publish_data')
    ) {
      const url = new URL(authRequest?.redirect_uri);
      const apps = wallet.walletConfig.identities[identityIndex]?.apps;
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
    next(identityIndex);
  };

  return (
    <Box flexGrow={1} position="relative">
      <Drawer
        close={() => {
          setIdentityIndex(undefined);
          doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_BACK);
          setTimeout(() => setReusedApps([]), 250);
        }}
        showing={reusedApps.length > 0}
        apps={reusedApps}
        confirm={async (hideWarning: boolean) => {
          if (hideWarning) {
            doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_DISABLED);
            const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
            await wallet.updateConfigForReuseWarning({ gaiaConfig });
          }
          doTrack(CHOOSE_ACCOUNT_REUSE_WARNING_CONTINUE);
          next(identityIndex as number);
        }}
      />
      <Screen textAlign="center">
        <ScreenHeader hideIcon title="Continue with Secret Key" rightContent={<SettingsButton />} />
        <AppIcon mt={10} mb={4} size="72px" />
        <ScreenBody
          body={[
            <Title pb={2}>Choose an account</Title>,
            `to use with ${appName}`,
            <Accounts
              identities={identities}
              next={(identityIndex: number) => didSelectAccount({ identityIndex })}
              showAddAccount
            />,
          ]}
        />
        <ScreenFooter>
          <PoweredBy />
        </ScreenFooter>
      </Screen>
    </Box>
  );
};
