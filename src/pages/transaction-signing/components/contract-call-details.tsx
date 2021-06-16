import React, { memo } from 'react';
import { Stack, color, StackProps } from '@stacks/ui';
import { deserializeCV, cvToString, getCVTypeString } from '@stacks/transactions';

import { Divider } from '@components/divider';
import { useExplorerLink } from '@common/hooks/use-explorer-link';
import { Caption, Title } from '@components/typography';
import { ContractPreview } from '@pages/transaction-signing/components/contract-preview';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';

import { AttachmentRow } from './attachment-row';
import { RowItem } from './row-item';
import { useTransactionFunction } from '@pages/transaction-signing/hooks/use-transaction';

interface ArgumentProps {
  arg: string;
  index: number;
}

const FunctionArgumentRow: React.FC<ArgumentProps> = memo(({ arg, index, ...rest }) => {
  const txFunction = useTransactionFunction();
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);
  const name = txFunction?.args[index].name || null;

  return <RowItem name={name} type={getCVTypeString(argCV)} value={strValue} {...rest} />;
});

const FunctionArgumentsList = memo((props: StackProps) => {
  const transactionRequest = useTransactionRequest();

  if (!transactionRequest || transactionRequest.txType !== 'contract_call') {
    return null;
  }
  const hasArgs = transactionRequest.functionArgs.length > 0;
  return (
    <>
      {hasArgs ? (
        <Stack divider={<Divider />} spacing="base" {...props}>
          {transactionRequest.functionArgs.map((arg, index) => {
            return (
              <React.Suspense fallback={<>loading</>}>
                <FunctionArgumentRow key={`${arg}-${index}`} arg={arg} index={index} />
              </React.Suspense>
            );
          })}
        </Stack>
      ) : (
        <Caption>There are no additional arguments passed for this function call.</Caption>
      )}
    </>
  );
});

export const ContractCallDetailsSuspense = () => {
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
};

export const ContractCallDetails = () => (
  <React.Suspense fallback={<></>}>
    <ContractCallDetailsSuspense />
  </React.Suspense>
);
