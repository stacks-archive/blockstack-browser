import React, { memo } from 'react';
import { Stack, color, StackProps } from '@stacks/ui';
import { Divider } from '@components/divider';
import { deserializeCV, cvToString, getCVTypeString } from '@stacks/transactions';
import { AttachmentRow } from './attachment-row';
import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { Caption, Title } from '@components/typography';
import { ContractPreview } from '@components/transactions/contract-preview';
import { RowItem } from '@components/transactions/row-item';
import { useTransactionRequest } from '@common/hooks/transaction/use-transaction';
import { useLoadable } from '@common/hooks/use-loadable';
import { transactionFunctionsState } from '@store/transactions/contract-call';

interface ArgumentProps {
  arg: string;
  index: number;
}

const FunctionArgumentRow: React.FC<ArgumentProps> = memo(({ arg, index, ...rest }) => {
  const payload = useLoadable(transactionFunctionsState);
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);
  const name = payload.value?.args[index].name || null;

  return <RowItem name={name} type={getCVTypeString(argCV)} value={strValue} {...rest} />;
});

const FunctionArgumentsList = memo((props: StackProps) => {
  const transactionRequest = useTransactionRequest();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') {
    return null;
  }
  const hasArgs = transactionRequest.functionArgs.length > 0;
  return (
    <Stack divider={<Divider />} spacing="base" {...props}>
      {hasArgs ? (
        transactionRequest.functionArgs.map((arg, index) => {
          return <FunctionArgumentRow key={`${arg}-${index}`} arg={arg} index={index} />;
        })
      ) : (
        <Caption>There are no additional arguments passed for this function call.</Caption>
      )}
    </Stack>
  );
});

export const ContractCallDetails = memo(() => {
  const transactionRequest = useTransactionRequest();
  const { handleOpenTxLink } = useExplorerLink();
  if (!transactionRequest || transactionRequest.txType !== 'contract_call') return null;
  const { contractAddress, contractName, functionName, attachment } = transactionRequest;

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
        onClick={() => handleOpenTxLink(`${contractAddress}.${contractName}`)}
        contractAddress={contractAddress}
        contractName={contractName}
        functionName={functionName}
      />
      <Stack divider={<Divider />} spacing="base">
        <FunctionArgumentsList />
        {attachment && <AttachmentRow />}
      </Stack>
    </Stack>
  );
});
