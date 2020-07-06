import React, { useState } from 'react';
import { Identity } from '@blockstack/keychain';
import { Text, Flex, FlexProps, Spinner } from '@blockstack/ui';
import { ScreenPaths } from '@store/onboarding/types';
import { PlusInCircle } from '@components/icons/plus-in-circle';
import { ListItem } from './list-item';
import { AccountAvatar } from './account-avatar';
import { useAnalytics } from '@common/hooks/use-analytics';

const loadingProps = { color: '#A1A7B3' };
const getLoadingProps = (loading: boolean) => (loading ? loadingProps : {});

interface AccountItemProps extends FlexProps {
  label: string;
  iconComponent?: (props: { hover: boolean }) => void;
  isFirst?: boolean;
  hasAction?: boolean;
  onClick?: () => void;
  address?: string;
  selectedAddress?: string | null;
  loading?: boolean;
}

const AccountItem = ({ label, address, selectedAddress, ...rest }: AccountItemProps) => {
  const loading = address === selectedAddress;
  return (
    <Flex alignItems="center" maxWidth="100%" {...rest}>
      <Flex flex={1} maxWidth="100%">
        <Text
          display="block"
          maxWidth="100%"
          textAlign="left"
          textStyle="body.small.medium"
          style={{ wordBreak: 'break-word' }}
          {...getLoadingProps(!!selectedAddress)}
        >
          {label.replace(/\.id\.blockstack$/, '')}
        </Text>
      </Flex>
      <Flex width={4} flexDirection="column" mr={3}>
        {loading && <Spinner width={4} height={4} {...loadingProps} />}
      </Flex>
    </Flex>
  );
};

interface AccountsProps {
  identities: Identity[];
  showAddAccount?: boolean;
  next?: (identityIndex: number) => void;
}

export const Accounts = ({ identities, showAddAccount, next }: AccountsProps) => {
  const [selectedAddress, setSelectedAddress] = useState<null | string>(null);
  const { doChangeScreen } = useAnalytics();

  return (
    <Flex flexDirection="column">
      {identities.map(({ defaultUsername, address }, key) => {
        return (
          <ListItem
            key={key}
            isFirst={key === 0}
            cursor={selectedAddress ? 'not-allowed' : 'pointer'}
            iconComponent={() => <AccountAvatar username={defaultUsername || address} mr={3} />}
            hasAction={!!next && selectedAddress === null}
            onClick={() => {
              if (!next) return;
              if (selectedAddress) return;
              setSelectedAddress(address);
              next(key);
            }}
          >
            <AccountItem
              address={address}
              selectedAddress={selectedAddress}
              label={defaultUsername || address}
              data-test={`account-index-${key}`}
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
              justify="center"
              width="36px"
              mr={3}
              color="ink.300"
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
