import React, { useState, useEffect } from 'react';
import { Flex, FlexProps, Spinner, color, Stack } from '@stacks/ui';
import { Caption, Text, Title } from '@components/typography';
import { ScreenPaths } from '@store/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';
import { ListItem } from './list-item';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { getStxAddress, Account, getAccountDisplayName } from '@stacks/wallet-sdk';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { truncateMiddle } from '@stacks/ui-utils';
import { useAccountDisplayName, useAccountNames } from '@common/hooks/use-account-names';
import { AccountAvatar } from '@components/account-avatar';
import { SpaceBetween } from '@components/space-between';

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

const AccountItem: React.FC<AccountItemProps> = ({
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
  const { wallet, transactionVersion } = useWallet();
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);
  const { decodedAuthRequest } = useOnboardingState();
  const doChangeScreen = useDoChangeScreen();
  useEffect(() => {
    if (typeof accountIndex === 'undefined' && selectedAddress) {
      setSelectedAddress(null);
    }
  }, [accountIndex, setSelectedAddress, selectedAddress]);
  const names = useAccountNames();
  if (!wallet) return null;

  const accounts = wallet.accounts.map(account => ({
    ...account,
    stxAddress: getStxAddress({ account, transactionVersion }),
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    number: account.index + 1,
  }));

  const disableSelect = !decodedAuthRequest || !!selectedAddress;

  return (
    <Flex flexDirection="column" {...rest}>
      {accounts.map((account, index) => {
        const name = names.value?.[index]?.names?.[0] || getAccountDisplayName(account);

        return (
          <ListItem
            key={account.stxAddress}
            isFirst={index === 0}
            cursor={disableSelect ? 'not-allowed' : 'pointer'}
            iconComponent={() => <AccountAvatar account={account} name={name} />}
            hasAction={!!next && selectedAddress === null}
            data-test={`account-${(account?.username || account?.stxAddress).split('.')[0]}`}
            onClick={() => {
              if (!next) return;
              if (selectedAddress) return;
              setSelectedAddress(account?.stxAddress);
              next(index);
            }}
          >
            <AccountItem
              address={account.stxAddress}
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
