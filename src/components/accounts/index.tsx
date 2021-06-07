import React, { useState, useEffect } from 'react';
import { color, Flex, FlexProps, Spinner, Stack } from '@stacks/ui';
import { Caption, Title, Text } from '@components/typography';

import { ListItem } from './list-item';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useWallet } from '@common/hooks/use-wallet';

import { truncateMiddle } from '@stacks/ui-utils';
import { Account, getAccountDisplayName } from '@stacks/wallet-sdk';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useAccountDisplayName, useAccountNames } from '@common/hooks/account/use-account-names';

import { accountsWithAddressState } from '@store/accounts';
import { useLoadable } from '@common/hooks/use-loadable';
import { AccountAvatar } from '@components/account-avatar';
import { SpaceBetween } from '@components/space-between';

import { ScreenPaths } from '@store/common/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  iconComponent?: (props: { hover: boolean }) => void;
  isFirst?: boolean;
  hasAction?: boolean;
  onClick?: () => void;
  address?: string;
  selectedAddress?: string | null;
  account: Account;
}

export const AccountItem: React.FC<AccountItemProps> = ({
  address,
  selectedAddress,
  account,
  ...rest
}) => {
  const { decodedAuthRequest } = useOnboardingState();
  const name = useAccountDisplayName(account);
  const loading = address === selectedAddress;
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
  return (
    <SpaceBetween width="100%" alignItems="center">
      <Stack textAlign="left" ml="base" isInline alignItems="center" spacing="base" {...rest}>
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
            {truncateMiddle(address as string, 6)}
          </Caption>
        </Stack>
      </Stack>
      {loading && <Spinner width={4} height={4} {...loadingProps} />}
    </SpaceBetween>
  );
};

interface AccountsProps extends FlexProps {
  accountIndex?: number;
  showAddAccount?: boolean;
  next?: (accountIndex: number) => void;
}

export const Accounts: React.FC<AccountsProps> = ({
  showAddAccount,
  accountIndex,
  next,
  ...rest
}) => {
  const { wallet } = useWallet();
  const { value: accounts } = useLoadable(accountsWithAddressState);
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);
  const { decodedAuthRequest } = useOnboardingState();
  const doChangeScreen = useDoChangeScreen();
  useEffect(() => {
    if (typeof accountIndex === 'undefined' && selectedAddress) {
      setSelectedAddress(null);
    }
  }, [accountIndex, setSelectedAddress, selectedAddress]);
  const names = useAccountNames();
  if (!wallet || !accounts) return null;
  const disableSelect = !decodedAuthRequest || !!selectedAddress;

  return (
    <Flex flexDirection="column" {...rest}>
      {accounts.map((account, index) => {
        const name = names.value?.[index]?.names?.[0] || getAccountDisplayName(account);

        return (
          <ListItem
            key={account.address}
            isFirst={index === 0}
            cursor={disableSelect ? 'not-allowed' : 'pointer'}
            iconComponent={() => <AccountAvatar account={account} name={name} mr={3} />}
            hasAction={!!next && selectedAddress === null}
            data-test={`account-list-item-${account.address}`}
            onClick={() => {
              if (!next) return;
              if (selectedAddress) return;
              setSelectedAddress(account.address);
              next(index);
            }}
          >
            <AccountItem
              address={account.address}
              selectedAddress={selectedAddress}
              data-test={`account-index-${index}`}
              account={account}
            />
          </ListItem>
        );
      })}
      {showAddAccount && (
        <ListItem
          onClick={() => {
            if (selectedAddress) return;
            doChangeScreen(ScreenPaths.ADD_ACCOUNT);
          }}
          cursor={selectedAddress ? 'not-allowed' : 'pointer'}
          hasAction
          iconComponent={() => (
            <Flex
              justifyContent="center"
              width="36px"
              mr={3}
              color={color('text-caption')}
              transition="0.08s all ease-in-out"
            >
              <PlusInCircle />
            </Flex>
          )}
        >
          <Text textStyle="body.small.medium" {...getLoadingProps(!!selectedAddress)}>
            Add a new account
          </Text>
        </ListItem>
      )}
    </Flex>
  );
};
