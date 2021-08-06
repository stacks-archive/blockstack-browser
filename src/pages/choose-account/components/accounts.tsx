import React, { useCallback, memo } from 'react';
import { Box, BoxProps, color, FlexProps, Spinner, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { useWallet } from '@common/hooks/use-wallet';

import { truncateMiddle } from '@stacks/ui-utils';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';

import { accountsWithAddressState, AccountWithAddress } from '@store/accounts';
import { AccountAvatarWithName } from '@features/account-avatar/account-avatar';
import { SpaceBetween } from '@components/space-between';

import { usePressable } from '@components/item-hover';
import { FiPlusCircle } from 'react-icons/fi';

import { accountDrawerStep, AccountStep, showAccountsStore } from '@store/ui';
import { useLoading } from '@common/hooks/use-loading';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { AccountBalanceCaption } from '@features/account-balance-caption';
import { cleanUsername, slugify } from '@common/utils';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  account: AccountWithAddress;
}

const AccountTitlePlaceholder = ({
  account,
  ...rest
}: { account: AccountWithAddress } & BoxProps) => {
  const name =
    (account?.username && cleanUsername(account.username)) || `Account ${account?.index + 1}`;
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

const AccountTitle = ({ account, ...rest }: { account: AccountWithAddress } & BoxProps) => {
  const name = useAccountDisplayName(account);
  return (
    <Title fontSize={2} lineHeight="1rem" fontWeight="400" {...rest}>
      {name}
    </Title>
  );
};

export const AccountItem: React.FC<AccountItemProps> = ({ selectedAddress, account, ...rest }) => {
  const [component, bind] = usePressable(true);
  const { isLoading, setIsLoading } = useLoading(`CHOOSE_ACCOUNT__${account.address}`);
  const { doFinishSignIn } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();

  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
  const handleOnClick = useCallback(async () => {
    setIsLoading();
    await doFinishSignIn(account.index);
  }, [setIsLoading, doFinishSignIn, account]);

  const accountSlug = slugify(`Account ${account?.index + 1}`);

  return (
    <Box
      data-testid={`account-${accountSlug}-${account.index}`}
      onClick={() => handleOnClick()}
      {...bind}
      {...rest}
    >
      <Stack spacing="base" isInline>
        <AccountAvatarWithName flexGrow={0} account={account} />
        <SpaceBetween width="100%" alignItems="center">
          <Stack textAlign="left" spacing="base-tight">
            <React.Suspense
              fallback={
                <AccountTitlePlaceholder {...getLoadingProps(showLoadingProps)} account={account} />
              }
            >
              <AccountTitle {...getLoadingProps(showLoadingProps)} account={account} />
            </React.Suspense>
            <Stack alignItems="center" spacing="6px" isInline>
              <Caption fontSize={0} {...getLoadingProps(showLoadingProps)}>
                {truncateMiddle(account.address, 4)}
              </Caption>
              <React.Suspense fallback={<></>}>
                <AccountBalanceCaption address={account.address} />
              </React.Suspense>
            </Stack>
          </Stack>
          {isLoading && <Spinner width={4} height={4} {...loadingProps} />}
        </SpaceBetween>
      </Stack>
      {component}
    </Box>
  );
};

const AddAccountAction = memo(() => {
  const setAccounts = useUpdateAtom(showAccountsStore);
  const setAccountDrawerStep = useUpdateAtom(accountDrawerStep);
  const [component, bind] = usePressable(true);

  return (
    <Box
      px="base-tight"
      py="tight"
      onClick={() => {
        setAccounts(true);
        setAccountDrawerStep(AccountStep.Create);
      }}
      {...bind}
    >
      <Stack isInline alignItems="center" color={color('text-body')}>
        <Box size="16px" as={FiPlusCircle} color={color('brand')} />
        <Text color="currentColor">Generate new account</Text>
      </Stack>
      {component}
    </Box>
  );
});

interface AccountsProps extends FlexProps {
  accountIndex?: number;
  showAddAccount?: boolean;
  next?: (accountIndex: number) => void;
}

export const Accounts: React.FC<AccountsProps> = memo(
  ({ showAddAccount, accountIndex, next, ...rest }) => {
    const { wallet } = useWallet();
    const accounts = useAtomValue(accountsWithAddressState);
    const { decodedAuthRequest } = useOnboardingState();

    if (!wallet || !accounts || !decodedAuthRequest) return null;

    return (
      <>
        <Stack py="extra-loose" spacing="loose" px="extra-loose" {...rest}>
          {accounts.map(account => (
            <AccountItem key={account.address} account={account} />
          ))}
          <AddAccountAction />
        </Stack>
      </>
    );
  }
);
