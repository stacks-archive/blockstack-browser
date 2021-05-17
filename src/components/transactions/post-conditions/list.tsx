import React from 'react';
import { Box, Circle, color, Flex, Stack } from '@stacks/ui';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentPostConditionIndexStore,
  pendingTransactionStore,
  postConditionsStore,
  showTxDetails,
} from '@store/transaction';
import { PostConditionComponent } from './single';
import { TransactionTypes } from '@stacks/connect';
import { stacksValue } from '@common/stacks-utils';
import { IconLock } from '@tabler/icons';
import { Body } from '@components/typography';
import { TransactionEventCard } from '@components/transactions/event-card';
import { truncateMiddle } from '@stacks/ui-utils';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

function usePostconditionsState() {
  const showDetails = useRecoilValue(showTxDetails);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const setShowDetails = useSetRecoilState(showTxDetails);
  const postConditions = useRecoilValue(postConditionsStore);
  const setCurrentPostConditionIndex = useSetRecoilState(currentPostConditionIndexStore);
  const { handleUpdateSelectedAsset } = useSelectedAsset();

  return {
    showDetails,
    pendingTransaction,
    setShowDetails,
    postConditions,
    setCurrentPostConditionIndex,
    handleUpdateSelectedAsset,
  };
}

function StxPostcondition() {
  const { pendingTransaction } = usePostconditionsState();
  if (!pendingTransaction || pendingTransaction.txType !== TransactionTypes.STXTransfer)
    return null;
  return (
    <TransactionEventCard
      title="You'll send exactly"
      iconChar="S"
      icon="STX"
      amount={stacksValue({ value: pendingTransaction.amount, withTicker: false })}
      ticker="STX"
      left="Stacks Token"
      right={
        pendingTransaction.txType === TransactionTypes.STXTransfer
          ? `To ${truncateMiddle(pendingTransaction.recipient, 6)}`
          : undefined
      }
    />
  );
}

function NoPostconditions() {
  return (
    <Stack alignItems="center" spacing="base" p="base-loose" isInline>
      <Circle bg={color('bg-4')} flexShrink={0}>
        <IconLock />
      </Circle>
      <Box flexGrow={1}>
        <Body>
          No transfers (besides fees) will be made from your account or the transaction will abort.
        </Body>
      </Box>
    </Stack>
  );
}

function PostConditionsList() {
  const { postConditions } = usePostconditionsState();
  return (
    <>
      {postConditions.map((pc, index) => (
        <PostConditionComponent
          pc={pc}
          key={`${pc.type}-${pc.conditionCode}`}
          isLast={index === postConditions.length - 1}
        />
      ))}
    </>
  );
}

export const PostConditions: React.FC = () => {
  const { pendingTransaction, postConditions } = usePostconditionsState();

  const hasPostConditions = postConditions.length > 0;

  const isStxTransfer =
    pendingTransaction?.txType === TransactionTypes.STXTransfer && !hasPostConditions;

  return (
    <Flex
      border="4px solid"
      borderColor={color('border')}
      borderRadius="12px"
      width="100%"
      flexDirection="column"
      my="loose"
    >
      {hasPostConditions ? (
        <PostConditionsList />
      ) : isStxTransfer ? (
        <StxPostcondition />
      ) : (
        <NoPostconditions />
      )}
    </Flex>
  );
};
