import React, { useCallback, memo } from 'react';
import { Box, color, FlexProps, Spinner, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';

import { useWallet } from '@common/hooks/use-wallet';

import { truncateMiddle } from '@stacks/ui-utils';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';

import { accountsWithAddressState, AccountWithAddress } from '@store/accounts';
import { useLoadable } from '@common/hooks/use-loadable';
import { AccountAvatar } from '@components/account-avatar';
import { SpaceBetween } from '@components/space-between';

import { cleanUsername, slugify } from '@common/utils';
import { usePressable } from '@components/item-hover';
import { FiPlusCircle } from 'react-icons/fi';
import { useSetRecoilState } from 'recoil';
import { accountDrawerStep, AccountStep, showAccountsStore } from '@store/ui';
import { useLoading } from '@common/hooks/use-loading';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  selectedAddress?: string | null;
  account: AccountWithAddress;
}

export const AccountItem: React.FC<AccountItemProps> = ({ selectedAddress, account, ...rest }) => {
  const [component, bind] = usePressable(true);
  const { isLoading, setIsLoading } = useLoading(`CHOOSE_ACCOUNT__${account.address}`);
  const { doFinishSignIn } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);

  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
  const handleOnClick = useCallback(async () => {
    setIsLoading();
    await doFinishSignIn(account.index);
  }, [setIsLoading, doFinishSignIn, account]);

  return (
    <Stack
      spacing="base"
      data-test={`account-${slugify(cleanUsername(name))}-${account.index}`}
      isInline
      onClick={() => handleOnClick()}
      {...bind}
      {...rest}
    >
      <AccountAvatar flexGrow={0} account={account} name={name} />
      <SpaceBetween width="100%" alignItems="center">
        <Stack textAlign="left" isInline alignItems="center" spacing="base">
          <Stack spacing="base-tight">
            <Title
              {...getLoadingProps(showLoadingProps)}
              fontSize={2}
              lineHeight="1rem"
              fontWeight="400"
            >
              {name}
            </Title>
            <Caption fontSize={0} {...getLoadingProps(showLoadingProps)}>
              {truncateMiddle(account.address)}
            </Caption>
          </Stack>
        </Stack>
        {isLoading && <Spinner width={4} height={4} {...loadingProps} />}
      </SpaceBetween>
      {component}
    </Stack>
  );
};

const AddAccountAction = memo(() => {
  const setAccounts = useSetRecoilState(showAccountsStore);
  const setAccountDrawerStep = useSetRecoilState(accountDrawerStep);
  return (
    <SpaceBetween alignItems="center">
      <Stack
        isInline
        p="base"
        bg={color('bg-4')}
        borderRadius="10px"
        alignItems="center"
        color={color('text-body')}
        _hover={{ cursor: 'pointer', color: color('brand') }}
        onClick={() => {
          setAccounts(true);
          setAccountDrawerStep(AccountStep.Create);
        }}
      >
        <Box size="16px" as={FiPlusCircle} color={color('brand')} />
        <Text color="currentColor">Add account</Text>
      </Stack>
    </SpaceBetween>
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
    const { value: accounts } = useLoadable(accountsWithAddressState);
    const { decodedAuthRequest } = useOnboardingState();

    if (!wallet || !accounts || !decodedAuthRequest) return null;

    return (
      <Stack py="extra-loose" spacing="loose" px="extra-loose" {...rest}>
        <Stack spacing="loose">
          {accounts.map(account => (
            <AccountItem key={account.address} account={account} />
          ))}
        </Stack>
        <AddAccountAction />
      </Stack>
    );
  }
);
