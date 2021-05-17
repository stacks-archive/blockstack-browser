import React from 'react';
import {
  IconArrowDown,
  IconArrowUp,
  IconCode,
  IconLayoutList,
  IconMoodSad,
  IconPlus,
} from '@tabler/icons';
import { Box, BoxProps, Circle, color, DynamicColorCircle, StxNexus } from '@stacks/ui';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { useWallet } from '@common/hooks/use-wallet';

type Tx = MempoolTransaction | Transaction;

interface TypeIconWrapperProps extends BoxProps {
  icon: React.FC<any>;
  status: Tx['tx_status'];
}

const TypeIconWrapper: React.FC<TypeIconWrapperProps> = ({ status, icon: Icon, ...rest }) => (
  <Circle
    bottom="-2px"
    right="-9px"
    position="absolute"
    size="21px"
    bg={color(
      status === 'pending' ? 'feedback-alert' : status !== 'success' ? 'feedback-error' : 'brand'
    )}
    color={color('bg')}
    border="2px solid"
    borderColor={color('bg')}
    {...rest}
  >
    <Box size="13px" as={Icon} />
  </Circle>
);

const TypeIcon: React.FC<
  {
    transaction: Tx;
  } & BoxProps
> = ({ transaction, ...rest }) => {
  const { currentAccountStxAddress } = useWallet();

  switch (transaction.tx_type) {
    case 'coinbase':
      return <TypeIconWrapper icon={IconPlus} status={transaction.tx_status} {...rest} />;
    case 'smart_contract':
      return <TypeIconWrapper icon={IconCode} status={transaction.tx_status} {...rest} />;
    case 'token_transfer': {
      const isSent = transaction.sender_address === currentAccountStxAddress;
      return (
        <TypeIconWrapper
          icon={isSent ? IconArrowUp : IconArrowDown}
          status={transaction.tx_status}
          {...rest}
        />
      );
    }
    case 'contract_call':
      return (
        <TypeIconWrapper
          icon={() => <FunctionIcon size="14px" />}
          status={transaction.tx_status}
          {...rest}
        />
      );
    default:
      return null;
  }
};

const ItemIconWrapper: React.FC<
  {
    icon: React.FC;
    transaction: Tx;
  } & BoxProps
> = ({ icon: Icon, transaction, ...rest }) => (
  <Circle position="relative" size="36px" bg={color('invert')} color={color('bg')} {...rest}>
    <Box size="20px" as={Icon} />
    <TypeIcon transaction={transaction} />
  </Circle>
);

export const TxItemIcon: React.FC<{ transaction: Tx }> = ({ transaction, ...rest }) => {
  switch (transaction.tx_type) {
    case 'coinbase':
      return <ItemIconWrapper icon={IconLayoutList} transaction={transaction} {...rest} />;
    case 'smart_contract':
      return (
        <DynamicColorCircle
          position="relative"
          string={`${transaction.smart_contract.contract_id}`}
          backgroundSize="200%"
          size="36px"
          {...rest}
        >
          <TypeIcon transaction={transaction} />
        </DynamicColorCircle>
      );
    case 'contract_call':
      return (
        <DynamicColorCircle
          position="relative"
          string={`${transaction.contract_call.contract_id}::${transaction.contract_call.function_name}`}
          backgroundSize="200%"
          size="36px"
          {...rest}
        >
          <TypeIcon transaction={transaction} />
        </DynamicColorCircle>
      );
    case 'token_transfer':
      return <ItemIconWrapper icon={StxNexus} transaction={transaction} {...rest} />;
    case 'poison_microblock':
      return <ItemIconWrapper icon={IconMoodSad} transaction={transaction} {...rest} />;
    default:
      return null;
  }
};
