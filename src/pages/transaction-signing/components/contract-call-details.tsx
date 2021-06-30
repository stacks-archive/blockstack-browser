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
import { LoadingRectangle } from '@components/loading-rectangle';

interface ArgumentProps {
  arg: string;
  index: number;
}

const useFuctionArgumentName = (index: number) => {
  const txFunction = useTransactionFunction();
  return txFunction?.args[index].name || null;
};
const FunctionArgumentNameSuspense = ({ index }: { index: number }) => {
  const name = useFuctionArgumentName(index);
  return <>{name}</>;
};
const FunctionArgumentNameFallback = () => {
  return <LoadingRectangle width="42px" height="14px" />;
};

const FunctionArgumentName = ({ index }: { index: number }) => {
  return (
    <React.Suspense fallback={<FunctionArgumentNameFallback />}>
      <FunctionArgumentNameSuspense index={index} />
    </React.Suspense>
  );
};

const FunctionArgumentRow: React.FC<ArgumentProps> = ({ arg, index, ...rest }) => {
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);

  return (
    <RowItem
      name={<FunctionArgumentName index={index} />}
      type={getCVTypeString(argCV)}
      value={strValue}
      {...rest}
    />
  );
};

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
              <React.Suspense fallback={<>loading</>} key={`${arg}-${index}`}>
                <FunctionArgumentRow arg={arg} index={index} />
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
