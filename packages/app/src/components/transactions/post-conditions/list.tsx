import React from 'react';
import { Box, Flex, Text, PadlockIcon, BoxProps } from '@stacks/ui';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import {
  postConditionsStore,
  showTxDetails,
  currentPostConditionIndexStore,
  pendingTransactionStore,
} from '@store/recoil/transaction';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { PostConditionComponent, PostConditionBase } from './single';
import { TransactionTypes } from '@stacks/connect';
import { stacksValue } from '@common/stacks-utils';

export const PostConditions: React.FC = () => {
  const showDetails = useRecoilValue(showTxDetails);
  const pendingTransaction = useRecoilValue(pendingTransactionStore);
  const setShowDetails = useSetRecoilState(showTxDetails);
  const postConditions = useRecoilValue(postConditionsStore);
  const setCurrentPostConditionIndex = useSetRecoilState(currentPostConditionIndexStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const { doChangeScreen } = useAnalytics();

  const postConditionComponents = postConditions.map((pc, index) => {
    return <PostConditionComponent pc={pc} key={`${pc.type}-${pc.conditionCode}`} index={index} />;
  });

  const getPostConditionsContent = () => {
    if (pendingTransaction?.txType === TransactionTypes.STXTransfer) {
      return (
        <PostConditionBase
          title="transfer exactly"
          iconChar="S"
          iconString="STX"
          amount={stacksValue({ value: pendingTransaction.amount, withTicker: false })}
          ticker="STX"
        />
      );
    }
    if (postConditions.length > 0) {
      return postConditionComponents;
    }
    return (
      <Flex>
        <Box>
          <PadlockIcon size="40px" />
        </Box>
        <Box flexGrow={1} ml="base" pr="loose">
          <Text fontSize={1}>
            Besides the fee, no tokens or assets will be transferred from your account
          </Text>
        </Box>
      </Flex>
    );
  };
  const getRadiusProps = (): BoxProps => {
    const radius = '12px';
    return {
      _first: {
        borderTopRightRadius: radius,
        borderTopLeftRadius: radius,
      },
      _last: {
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,
      },
    };
  };
  return (
    <Flex width="100%" flexDirection="column" my="loose">
      <Box
        borderColor="ink.150"
        borderWidth="1px"
        borderRadius="12px 12px 0 0"
        width="100%"
        {...getRadiusProps()}
        p="loose"
      >
        {getPostConditionsContent()}
      </Box>
      {pendingTransaction?.txType === TransactionTypes.STXTransfer ? null : (
        <Box
          borderColor="ink.150"
          borderWidth="0 1px 1px 1px"
          borderRadius="0 0 12px 12px"
          {...getRadiusProps()}
          width="100%"
          p="loose"
          textAlign="center"
        >
          <Text
            color="blue"
            cursor="pointer"
            fontSize={1}
            onClick={() => {
              if (showDetails) {
                setCurrentPostConditionIndex(undefined);
                setSelectedAsset(undefined);
                doChangeScreen(ScreenPaths.EDIT_POST_CONDITIONS);
              } else {
                setShowDetails(!showDetails);
              }
            }}
          >
            {showDetails ? 'Add a constraint' : 'View details'}
            {' >'}
          </Text>
        </Box>
      )}
    </Flex>
  );
};
