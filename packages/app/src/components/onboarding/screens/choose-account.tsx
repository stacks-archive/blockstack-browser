import React from 'react';
import { Screen, ScreenBody, Title, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { Box } from '@blockstack/ui';
import { ScreenHeader } from '@components/connected-screen-header';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { useSelector } from 'react-redux';
import { AppState } from '@store';
import { selectAppName } from '@store/onboarding/selectors';
import { Drawer } from '@components/drawer';
import { selectDecodedAuthRequest } from '@store/onboarding/selectors';
import { store } from '@store';
import { selectIdentities, selectCurrentWallet } from '@store/wallet/selectors';
import { ConfigApp } from '@blockstack/keychain/dist/wallet';
import { Wallet } from '@blockstack/keychain';
import { gaiaUrl } from '@common/constants';
import {
  doTrack,
  CHOOSE_ACCOUNT_REUSE_WARNING,
  CHOOSE_ACCOUNT_REUSE_WARNING_CONTINUE,
  CHOOSE_ACCOUNT_REUSE_WARNING_DISABLED,
  CHOOSE_ACCOUNT_REUSE_WARNING_BACK,
  CHOOSE_ACCOUNT_CHOSEN,
} from '@common/track';

interface ChooseAccountProps {
  next: (identityIndex: number) => void;
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = ({ next }) => {
  const { appName, identities, wallet } = useSelector((state: AppState) => ({
    appName: selectAppName(state),
    identities: selectIdentities(state),
    wallet: selectCurrentWallet(state) as Wallet,
  }));
  const [reusedApps, setReusedApps] = React.useState<ConfigApp[]>([]);
  const [identityIndex, setIdentityIndex] = React.useState<number | undefined>();

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
        const newReusedApps: ConfigApp[] = [];
        Object.keys(apps).forEach(origin => {
          const app = apps[origin];
          if (origin !== url.origin && app.scopes.includes('publish_data')) {
            newReusedApps.push(app);
          }
        });
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
          setReusedApps([]);
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
        <ScreenHeader hideIcon title="Continue with Secret Key" />
        <AppIcon mt={10} mb={4} size="72px" />
        <ScreenBody
          body={[
            <Title>Choose an account</Title>,
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
