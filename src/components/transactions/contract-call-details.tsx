import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Stack, color, StackProps } from '@stacks/ui';
import { Divider } from '@components/divider';
import { deserializeCV, cvToString, getCVTypeString } from '@stacks/transactions';
import { AttachmentRow } from './attachment-row';
import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { Caption, Title } from '@components/typography';
import { ContractPreview } from '@components/transactions/contract-preview';
import { RowItem } from '@components/transactions/row-item';

interface ArgumentProps {
  arg: string;
  index: number;
}

const Argument: React.FC<ArgumentProps> = ({ arg, index, ...rest }) => {
  const { pendingTransactionFunction } = useTxState();
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);
  const name =
    pendingTransactionFunction.state === 'hasValue'
      ? pendingTransactionFunction.contents?.args[index].name
      : null;

  return (
    <Stack spacing="base-loose" {...rest}>
      <RowItem name={name} type={getCVTypeString(argCV)} value={strValue} />
    </Stack>
  );
};

const Arguments = (props: StackProps) => {
  const { pendingTransaction } = useTxState();

  if (!pendingTransaction || pendingTransaction.txType !== 'contract_call') {
    return null;
  }
  const hasArgs = pendingTransaction.functionArgs.length > 0;
  return (
    <Stack divider={<Divider />} spacing="base" {...props}>
      {hasArgs ? (
        pendingTransaction.functionArgs.map((arg, index) => {
          return <Argument key={`${arg}-${index}`} arg={arg} index={index} />;
        })
      ) : (
        <Caption>There are no additional arguments passed for this function call.</Caption>
      )}
    </Stack>
  );
};

export const ContractCallDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  const { handleOpenTxLink } = useExplorerLink();
  if (!pendingTransaction || pendingTransaction.txType !== 'contract_call') {
    return null;
  }

  return (
    <Stack
      spacing="loose"
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      py="extra-loose"
      px="base-loose"
    >
      <Title as="h2" fontWeight="500">
        Function and arguments
      </Title>

      <ContractPreview
        onClick={() =>
          handleOpenTxLink(
            `${pendingTransaction.contractAddress}.${pendingTransaction.contractName}`
          )
        }
        contractAddress={pendingTransaction.contractAddress}
        contractName={pendingTransaction.contractName}
        functionName={pendingTransaction.functionName}
      />
      <Stack divider={<Divider />} spacing="base">
        <Arguments />
        {pendingTransaction?.attachment ? <AttachmentRow /> : null}
      </Stack>
    </Stack>
  );
};
