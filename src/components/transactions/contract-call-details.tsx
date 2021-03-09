import React from 'react';
import { useTxState } from '@common/hooks/use-tx-state';
import { Box, Text, Flex } from '@stacks/ui';
import { Divider } from '@components/divider';
import { truncateMiddle } from '@stacks/ui-utils';
import { deserializeCV, cvToString, ClarityType, getCVTypeString } from '@stacks/transactions';
import { LoadingRectangle } from '@components/loading-rectangle';
import { NonceRow } from './nonce-row';

interface ArgumentProps {
  arg: string;
  index: number;
}
const Argument: React.FC<ArgumentProps> = ({ arg, index }) => {
  const { pendingTransactionFunction } = useTxState();
  const argCV = deserializeCV(Buffer.from(arg, 'hex'));
  const strValue = cvToString(argCV);
  const name =
    pendingTransactionFunction.state === 'hasValue'
      ? pendingTransactionFunction.contents?.args[index].name
      : null;
  const getCVString = () => {
    if (argCV.type === ClarityType.PrincipalStandard) {
      return truncateMiddle(strValue);
    }
    return strValue;
  };
  return (
    <Box mt="base" width="100%">
      <Flex>
        <Box flexGrow={1}>
          {name ? (
            <Text display="block" fontSize={1}>
              {name}
            </Text>
          ) : (
            <LoadingRectangle width="100px" height="14px" />
          )}
          <Text textStyle="caption" color="ink.600" fontSize={0}>
            {getCVTypeString(argCV)}
          </Text>
        </Box>
        <Box>
          <Text fontSize={1} color="ink.600" title={strValue}>
            {getCVString()}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export const ContractCallDetails: React.FC = () => {
  const { pendingTransaction } = useTxState();
  if (!pendingTransaction || pendingTransaction.txType !== 'contract_call') {
    return null;
  }

  const args = pendingTransaction.functionArgs.map((arg, index) => {
    return <Argument key={`${arg}-${index}`} arg={arg} index={index} />;
  });
  return (
    <>
      <Box my="base">
        <Text fontWeight="500" display="block" fontSize={2}>
          Contract
        </Text>
        <Text fontSize={1} color="blue">
          {truncateMiddle(pendingTransaction.contractAddress)}.{pendingTransaction.contractName}
        </Text>
      </Box>
      <Divider />
      <Box my="base">
        <Text fontWeight="500" display="block" fontSize={2}>
          Function
        </Text>
        <Text fontSize={1}>{pendingTransaction.functionName}</Text>
      </Box>
      <Divider />
      <Box mt="base">
        <Text fontWeight="500" display="block" fontSize={2}>
          {pendingTransaction.functionArgs.length > 0 ? 'Arguments' : 'No arguments provided'}
        </Text>
      </Box>
      <Box>
        <Flex flexDirection="column" flexWrap="wrap" width="100%">
          {args}
        </Flex>
      </Box>
      <NonceRow />
    </>
  );
};
