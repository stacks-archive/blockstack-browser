import React, { useCallback } from 'react';
import { Text, Stack, StackProps } from '@stacks/ui';
import { addressToString, PostCondition, PostConditionType } from '@stacks/transactions';
import { useSetRecoilState } from 'recoil';
import { postConditionsStore, currentPostConditionIndexStore } from '@store/transaction';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/types';
import { Asset, selectedAssetStore } from '@store/asset-search';
import { useFetchBalances } from '@common/hooks/use-account-info';
import { toHumanReadableStx, truncateMiddle } from '@stacks/ui-utils';
import { getPostConditionTitle, stacksValue } from '@common/stacks-utils';
import { AssetAvatar } from '@components/stx-avatar';

interface PostConditionBaseProps {
  title: string;
  amount: string;
  iconString: string;
  iconChar: string;
  ticker: string;
  edit?: () => void;
  remove?: () => void;
}

type PostConditionDetailsProps = Pick<PostConditionBaseProps, 'iconString' | 'amount' | 'ticker'> &
  StackProps;

const PostConditionDetails: React.FC<PostConditionDetailsProps> = ({
  iconString,
  amount,
  ticker,
  ...rest
}) => {
  return (
    <Stack isInline alignItems="center" flexGrow={1} width="100%" {...rest}>
      <AssetAvatar
        size="32px"
        useStx={iconString === 'STX'}
        gradientString={
          // TODO: use fully realized asset name
          iconString
        }
      />
      <Text fontWeight="600" fontSize={2}>
        {amount}
      </Text>

      <Text fontWeight="500" fontSize={2} ml="auto">
        {ticker}
      </Text>
    </Stack>
  );
};

type PostConditionActionsProps = Pick<PostConditionBaseProps, 'edit' | 'remove'> & StackProps;
const PostConditionActions: React.FC<PostConditionActionsProps> = ({ edit, remove, ...rest }) => {
  return (
    <Stack spacing="base-tight" isInline {...rest}>
      {edit && (
        <Text
          fontWeight="500"
          color="blue"
          onClick={edit}
          cursor="pointer"
          _hover={{
            textDecoration: 'underline',
          }}
        >
          Edit
        </Text>
      )}
      {remove && (
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
      )}
    </Stack>
  );
};

export const PostConditionBase: React.FC<PostConditionBaseProps> = props => {
  const { edit, remove, iconString, amount, ticker } = props;
  return (
    <Stack spacing="base-loose">
      <Text fontSize={2}>You {props.title}</Text>
      <PostConditionDetails iconString={iconString} amount={amount} ticker={ticker} />
      {(edit || remove) && <PostConditionActions edit={edit} remove={remove} />}
    </Stack>
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
  const doChangeScreen = useDoChangeScreen();
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
