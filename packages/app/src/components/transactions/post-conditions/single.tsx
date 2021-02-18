import React, { useCallback } from 'react';
import { Box, Flex, Text, DynamicColorCircle } from '@stacks/ui';
import { addressToString, PostCondition, PostConditionType } from '@stacks/transactions';
import { useSetRecoilState } from 'recoil';
import { postConditionsStore, currentPostConditionIndexStore } from '@store/recoil/transaction';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { Asset, selectedAssetStore } from '@store/recoil/asset-search';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';
import { getPostConditionTitle, stacksValue } from '@common/stacks-utils';

interface PostConditionBaseProps {
  title: string;
  amount: string;
  iconString: string;
  iconChar: string;
  ticker: string;
  edit?: () => void;
  remove?: () => void;
}
export const PostConditionBase: React.FC<PostConditionBaseProps> = props => {
  const { edit, remove } = props;
  return (
    <Box mb="base">
      <Flex flexDirection="column">
        <Box mb="base">
          <Text fontSize={2}>You {props.title}</Text>
        </Box>
        <Box>
          <Flex flexDirection="row">
            <Box>
              <DynamicColorCircle mr="base" size="32px" string={props.iconString}>
                {props.iconChar}
              </DynamicColorCircle>
            </Box>
            <Box pt="extra-tight" flexGrow={1}>
              <Text fontWeight="600" fontSize={2}>
                {props.amount}
              </Text>
            </Box>
            <Box pt="extra-tight">
              <Text fontWeight="500" fontSize={2}>
                {props.ticker}
              </Text>
            </Box>
          </Flex>
        </Box>
        {edit || remove ? (
          <Box mt="base">
            <Text
              fontWeight="500"
              color="blue"
              mr="base-tight"
              onClick={edit}
              cursor="pointer"
              _hover={{
                textDecoration: 'underline',
              }}
            >
              Edit
            </Text>
            <Text
              fontWeight="500"
              color="red"
              cursor="pointer"
              _hover={{
                textDecoration: 'underline',
              }}
              onClick={remove}
            >
              Remove
            </Text>
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
};

const pcIconString = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible) {
    const { assetInfo } = pc;
    return `${addressToString(assetInfo.address)}.${assetInfo.contractName}.${
      assetInfo.assetName.content
    }`;
  } else if (pc.conditionType === PostConditionType.STX) {
    return 'STX';
  } else {
    return pc.assetInfo.assetName.content;
  }
};

const pcIconChar = (pc: PostCondition) => {
  if ('assetInfo' in pc) {
    return pc.assetInfo.assetName.content[0];
  }
  return 'S';
};

const pcAmount = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible) {
    return pc.amount.toString();
  }
  if (pc.conditionType === PostConditionType.STX) {
    return stacksValue({ value: pc.amount.toString(), withTicker: false });
  }
  return '';
};

const pcTicker = (pc: PostCondition) => {
  if ('assetInfo' in pc) {
    return pc.assetInfo.assetName.content.slice(0, 3).toUpperCase();
  }
  return 'STX';
};

interface PostConditionProps {
  pc: PostCondition;
  index: number;
}
export const PostConditionComponent: React.FC<PostConditionProps> = ({ pc, index }) => {
  const setCurrentPostConditionIndex = useSetRecoilState(currentPostConditionIndexStore);
  const setSelectedAsset = useSetRecoilState(selectedAssetStore);
  const setPostConditions = useSetRecoilState(postConditionsStore);
  const balancesLoadable = useFetchBalances();
  const { doChangeScreen } = useAnalytics();
  const balancesJSON = JSON.stringify(balancesLoadable.value);

  const removePostCondition = useCallback(() => {
    setPostConditions(pcs => {
      const _postConditions = [...pcs];
      _postConditions.splice(index, 1);
      return _postConditions;
    });
  }, [index, setPostConditions]);

  const editPostCondition = useCallback(() => {
    setCurrentPostConditionIndex(index);
    let asset: Asset | undefined = undefined;
    const balances = JSON.parse(balancesJSON);
    if (pc.conditionType === PostConditionType.STX) {
      asset = {
        name: 'Stacks Token',
        contractAddress: '',
        balance: toHumanReadableStx(balances?.stx.balance || '0'),
        subtitle: '',
        type: 'stx',
      };
    } else if (pc.conditionType === PostConditionType.NonFungible) {
      const { assetInfo } = pc;
      const address = `${addressToString(assetInfo.address)}.${assetInfo.contractName}::${
        assetInfo.assetName.content
      }`;
      const balance = balances?.fungible_tokens[address]?.balance || '0';
      asset = {
        type: 'ft',
        subtitle: `${truncateMiddle(addressToString(assetInfo.address))}.${assetInfo.contractName}`,
        contractAddress: address,
        name: assetInfo.assetName.content,
        balance,
      };
    }
    setSelectedAsset(asset);
    doChangeScreen(ScreenPaths.EDIT_POST_CONDITIONS);
  }, [balancesJSON, setCurrentPostConditionIndex, doChangeScreen, index, pc, setSelectedAsset]);
  return (
    <PostConditionBase
      title={getPostConditionTitle(pc)}
      iconChar={pcIconChar(pc)}
      iconString={pcIconString(pc)}
      ticker={pcTicker(pc)}
      amount={pcAmount(pc)}
      edit={editPostCondition}
      remove={removePostCondition}
    />
  );
};
