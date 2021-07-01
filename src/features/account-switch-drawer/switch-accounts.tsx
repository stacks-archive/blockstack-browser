import React, { memo, useCallback } from 'react';
import { Box, Fade, Button, Stack, color, BoxProps, Spinner } from '@stacks/ui';
import { Title, Caption } from '@components/typography';

import { accountDrawerStep, AccountStep } from '@store/ui';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { truncateMiddle } from '@stacks/ui-utils';
import { SpaceBetween } from '@components/space-between';
import { FiCheck as IconCheck } from 'react-icons/fi';
import { AccountAvatar } from '@features/account-avatar/account-avatar';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';
import { useSwitchAccount } from '@common/hooks/account/use-switch-account';
import { useUpdateAtom } from 'jotai/utils';
import { useAccounts } from '@common/hooks/account/use-accounts';
import { AccountWithAddress } from '@store/accounts';
import { useLoading } from '@common/hooks/use-loading';
import { SettingsSelectors } from '../../../tests/integration/settings.selectors';

interface SwitchAccountProps {
  close: () => void;
}

interface WithAccount {
  account: AccountWithAddress;
}

const AccountNameSuspense = memo(({ account }: WithAccount) => {
  const name = useAccountDisplayName(account);

  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400">
      {name}
    </Title>
  );
});

const AccountName = memo(({ account, ...rest }: BoxProps & WithAccount) => {
  const defaultName = getAccountDisplayName(account);
  return (
    <Box {...rest}>
      <React.Suspense
        fallback={
          <Title fontSize={2} lineHeight="1rem" fontWeight="400">
            {defaultName}
          </Title>
        }
      >
        <AccountNameSuspense account={account} />
      </React.Suspense>
    </Box>
  );
});

const AccountAvatarSuspense = memo(({ account }: { account: AccountWithAddress }) => {
  const name = useAccountDisplayName(account);
  return <AccountAvatar name={name} account={account} />;
});

const AccountAvatarItem = memo(({ account, ...rest }: BoxProps & WithAccount) => {
  const defaultName = getAccountDisplayName(account);
  return (
    <Box {...rest}>
      <React.Suspense fallback={<AccountAvatar name={defaultName} account={account} />}>
        <AccountAvatarSuspense account={account} />
      </React.Suspense>
    </Box>
  );
});

const AccountListItem = memo(
  ({ account, handleClose }: { account: AccountWithAddress; handleClose: () => void }) => {
    const { isLoading, setIsLoading, setIsIdle } = useLoading('SWITCH_ACCOUNTS' + account.address);
    const { handleSwitchAccount, getIsActive } = useSwitchAccount(handleClose);
    const handleClick = useCallback(async () => {
      setIsLoading();
      setTimeout(async () => {
        await handleSwitchAccount(account.index);
        setIsIdle();
      }, 80);
    }, [setIsLoading, setIsIdle, account.index, handleSwitchAccount]);
    return (
      <SpaceBetween
        width="100%"
        key={`account-${account.index}`}
        data-test={SettingsSelectors.AccountIndex.replace('[index]', `${account.index}`)}
        _hover={{
          bg: color('bg-4'),
        }}
        cursor="pointer"
        py="base"
        px="extra-loose"
        onClick={handleClick}
        position="relative"
      >
        <Stack isInline alignItems="center" spacing="base">
          <AccountAvatarItem account={account} />
          <Stack spacing="base-tight">
            <AccountName account={account} />
            <Caption>{truncateMiddle(account.address)}</Caption>
          </Stack>
        </Stack>
        <Fade in={isLoading}>
          {styles => (
            <Spinner
              position="absolute"
              right="loose"
              color={color('text-caption')}
              size="18px"
              style={styles}
            />
          )}
        </Fade>
        <Fade in={getIsActive(account.index)}>
          {styles => (
            <Box
              as={IconCheck}
              size="18px"
              strokeWidth={2.5}
              color={color('brand')}
              style={styles}
              data-test={`account-checked-${account.index}`}
            />
          )}
        </Fade>
      </SpaceBetween>
    );
  }
);

const AccountList: React.FC<{ handleClose: () => void }> = memo(({ handleClose }) => {
  const accounts = useAccounts();
  return accounts ? (
    <>
      {accounts.map(account => {
        return (
          <AccountListItem handleClose={handleClose} key={account.address} account={account} />
        );
      })}
    </>
  ) : null;
});

export const SwitchAccounts: React.FC<SwitchAccountProps> = memo(({ close }) => {
  const setAccountDrawerStep = useUpdateAtom(accountDrawerStep);
  return (
    <>
      <AccountList handleClose={close} />
      <Box pt="base" pb="loose" px="loose">
        <Button onClick={() => setAccountDrawerStep(AccountStep.Create)}>Create an account</Button>
      </Box>
    </>
  );
});
