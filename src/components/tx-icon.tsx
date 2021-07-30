import React from 'react';
import {
  FiArrowDown as IconArrowDown,
  FiArrowUp as IconArrowUp,
  FiCode as IconCode,
  FiList as IconLayoutList,
  FiAlertOctagon as IconMoodSad,
  FiPlus as IconPlus,
} from 'react-icons/fi';
import { Box, BoxProps, Circle, color,ColorsStringLiteral, DynamicColorCircle } from '@stacks/ui';
import FunctionIcon from 'mdi-react/FunctionIcon';
import { useWallet } from '@common/hooks/use-wallet';
import { StxIcon } from './icons/stx-icon';
import { MicroblockIcon } from '@components/icons/microblock';
import { Tx, Statuses, statusFromTx } from '@common/api/transactions';

interface TypeIconWrapperProps extends BoxProps {
  icon: React.FC<any>;
  bg: any;
}

type statusColorMap = {
  [key in Statuses]: ColorsStringLiteral;
};

const colorFromTx = (tx: Tx): ColorsStringLiteral => {
  const colorMap: statusColorMap = {
    pending: 'feedback-alert',
    success_microblock: 'invert',
    success_anchor_block: 'brand',
    failed: 'feedback-error',
  };

  return colorMap[statusFromTx(tx)] ?? 'feedback-error';
};

export const TypeIconWrapper: React.FC<TypeIconWrapperProps> = ({ bg, icon: Icon, ...rest }) => (
  <Circle
    bottom="-2px"
    right="-9px"
    position="absolute"
    size="21px"
    bg={color(bg)}
    color={color('bg')}
    border="2px solid"
    borderColor={color('bg')}
    {...rest}
  >
    <Box size="13px" as={Icon} />
  </Circle>
);

const iconForTx = (tx: Tx, currentAccountStxAddress: string | undefined) => {
  const isSent = tx.sender_address === currentAccountStxAddress;

  const tokenTransferIcon = (tx: Tx) => {
    return 'is_unanchored' in tx && tx.is_unanchored
      ? () => (
          <MicroblockIcon
            size="13px"
            fill={color('bg')}
            borderColor={color('invert')}
            bg={color(colorFromTx(tx))}
          />
        )
      : isSent
      ? IconArrowUp
      : IconArrowDown;
  };

  const iconMap = {
    coinbase: IconPlus,
    smart_contract: IconCode,
    token_transfer: tokenTransferIcon(tx),
    contract_call: () => <FunctionIcon size="14px" />,
    poison_microblock: null,
  };
  return iconMap[tx.tx_type];
};

const TypeIcon: React.FC<
  {
    transaction: Tx;
  } & BoxProps
> = ({ transaction, ...rest }) => {
  const { currentAccountStxAddress } = useWallet();
  const icon = iconForTx(transaction, currentAccountStxAddress);

  if (
    ['coinbase', 'smart_contract', 'token_transfer', 'contract_call'].includes(
      transaction.tx_type
    ) &&
    icon
  ) {
    return <TypeIconWrapper icon={icon} bg={colorFromTx(transaction)} {...rest} />;
  }
  return null;
};

const ItemIconWrapper: React.FC<
  {
    icon: React.FC;
    transaction: Tx;
  } & BoxProps
> = ({ icon: Icon, transaction, ...rest }) => (
  <Circle position="relative" size="36px" bg={color('accent')} color={color('bg')} {...rest}>
    <Box as={Icon} />
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
      return <ItemIconWrapper icon={StxIcon} transaction={transaction} {...rest} />;
    case 'poison_microblock':
      return <ItemIconWrapper icon={IconMoodSad} transaction={transaction} {...rest} />;
    default:
      return null;
  }
};
