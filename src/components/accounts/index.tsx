import React, { useState, useEffect } from 'react';
import { Flex, FlexProps, Spinner, color, Stack } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import { ScreenPaths } from '@store/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';
import { ListItem } from './list-item';
import { AccountAvatar } from './account-avatar';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { getStxAddress, Account } from '@stacks/wallet-sdk';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { truncateMiddle } from '@stacks/ui-utils';
import { useAccountDisplayName } from '@common/hooks/use-account-names';

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
  const name = useAccountDisplayName();
  const loading = address === selectedAddress;
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
  return (
    <Flex alignItems="center" {...rest}>
      <Stack textAlign="left" spacing="2px">
        <Text
          display="block"
          maxWidth="100%"
          textAlign="left"
          fontWeight={500}
          fontSize={2}
          style={{ wordBreak: 'break-word' }}
          {...getLoadingProps(showLoadingProps)}
        >
          {name}
        </Text>
        <Caption fontSize={0} {...getLoadingProps(showLoadingProps)}>
          {truncateMiddle(address as string, 6)}
        </Caption>
      </Stack>
      <Flex width={4} flexDirection="column" mr={3}>
        {loading && <Spinner width={4} height={4} {...loadingProps} />}
      </Flex>
    </Flex>
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
        return (
          <ListItem
            key={account.stxAddress}
            isFirst={index === 0}
            cursor={disableSelect ? 'not-allowed' : 'pointer'}
            iconComponent={() => <AccountAvatar username={account.number.toString()} mr={3} />}
            hasAction={!!next && selectedAddress === null}
            data-test={`account-${(account.username || account.stxAddress).split('.')[0]}`}
            onClick={() => {
              if (!next) return;
              if (selectedAddress) return;
              setSelectedAddress(account.stxAddress);
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
