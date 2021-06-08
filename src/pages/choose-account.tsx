import React, { memo, useCallback, useEffect } from 'react';
import { Caption, Screen, ScreenBody } from '@screen';
import { Title } from '@components/typography';
import { Accounts } from '@components/accounts';
import { AppIcon } from '@components/app-icon';
import { ScreenPaths } from '@store/common/types';
import { useWallet } from '@common/hooks/use-wallet';
import { Navigate } from '@components/navigate';
import { Header } from '@components/header';
import { useAppDetails } from '@common/hooks/auth/use-app-details';
import { Stack } from '@stacks/ui';

interface ChooseAccountProps {
  back?: () => void;
}

export const ChooseAccount: React.FC<ChooseAccountProps> = memo(() => {
  const { name: appName } = useAppDetails();
  const { wallet, handleCancelAuthentication } = useWallet();

  const handleUnmount = useCallback(async () => {
    handleCancelAuthentication();
  }, [handleCancelAuthentication]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnmount);
    return () => window.removeEventListener('beforeunload', handleUnmount);
  }, [handleUnmount]);

  if (!wallet) {
    return <Navigate to={{ pathname: '/', hash: 'sign-up' }} screenPath={ScreenPaths.GENERATION} />;
  }

  return (
    <Screen textAlign="center" flexGrow={1} position="relative">
      <Header hideActions />
      <AppIcon mt="extra-loose" mb="loose" size="72px" />
      <ScreenBody
        body={[
          <Stack spacing="base">
            <Title fontSize={4}>Choose an account</Title>
            <Caption>to connect to {appName}</Caption>
          </Stack>,
          <Accounts mt="base" />,
        ]}
      />
    </Screen>
  );
});
