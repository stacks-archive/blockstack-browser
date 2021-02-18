import React, { useState, useEffect } from 'react';
import { Text, Flex, FlexProps, Spinner, color } from '@stacks/ui';
import { ScreenPaths } from '@store/onboarding/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';
import { ListItem } from './list-item';
import { AccountAvatar } from './account-avatar';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { getStxAddress, Account, getAccountDisplayName } from '@stacks/wallet-sdk';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';

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
  const loading = address === selectedAddress;
  const showLoadingProps = !!selectedAddress || !decodedAuthRequest;
  return (
    <Flex alignItems="center" maxWidth="100%" {...rest}>
      <Flex flex={1} maxWidth="100%" flexDirection="column">
        <Text
          display="block"
          maxWidth="100%"
          textAlign="left"
          textStyle="body.small.medium"
          style={{ wordBreak: 'break-word' }}
          mb="extra-tight"
          {...getLoadingProps(showLoadingProps)}
        >
          {getAccountDisplayName(account)}
        </Text>
        <Text display="block" fontSize={1} {...getLoadingProps(showLoadingProps)}>
          {address}
        </Text>
      </Flex>
      <Flex width={4} flexDirection="column" mr={3}>
        {loading && <Spinner width={4} height={4} {...loadingProps} />}
      </Flex>
    </Flex>
  );
};

interface AccountsProps {
  accountIndex?: number;
  showAddAccount?: boolean;
  next?: (accountIndex: number) => void;
}

export const Accounts = ({ showAddAccount, accountIndex, next }: AccountsProps) => {
  const { wallet, transactionVersion } = useWallet();
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);
  const { decodedAuthRequest } = useOnboardingState();
  const { doChangeScreen } = useAnalytics();

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
    <Flex flexDirection="column">
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
