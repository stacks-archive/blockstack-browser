import {
  addressToString,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostCondition,
  PostConditionType,
} from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import { useTransferableAssets } from '@common/hooks/use-assets';

export const getIconStringFromPostCondition = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible)
    return `${addressToString(pc.assetInfo.address)}.${pc.assetInfo.contractName.content}::${
      pc.assetInfo.assetName.content
    }`;
  if (pc.conditionType === PostConditionType.STX) return 'STX';
  return pc.assetInfo.assetName.content;
};

export const getAmountFromPostCondition = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible) return pc.amount.toString();
  if (pc.conditionType === PostConditionType.STX)
    return stacksValue({ value: pc.amount.toString(), withTicker: false, fixedDecimals: true });
  return '';
};

export const getSymbolFromPostCondition = (pc: PostCondition) => {
  if ('assetInfo' in pc) {
    return pc.assetInfo.assetName.content.slice(0, 3).toUpperCase();
  }
  return 'STX';
};
// this will use data from assets we have already
// if they exist, we can display better data for post conditions
export const useAssetInfoFromPostCondition = (pc: PostCondition) => {
  const assets = useTransferableAssets();
  if (pc.conditionType !== PostConditionType.Fungible) return;
  const assetName = pc.assetInfo.assetName.content;
  const contractAddress = addressToString(pc.assetInfo.address);
  const contractName = pc.assetInfo.contractName.content;

  const asset = assets?.value?.find(
    asset =>
      asset.contractAddress === contractAddress &&
      asset.contractName === contractName &&
      asset.name === assetName
  );

  return asset;
};

export function getPostConditionCodeMessage(
  code: FungibleConditionCode | NonFungibleConditionCode,
  isSender: boolean
) {
  const sender = isSender ? 'You' : 'The contract';
  switch (code) {
    case FungibleConditionCode.Equal:
      return `${sender} will transfer exactly`;

    case FungibleConditionCode.Greater:
      return `${sender} will transfer more than`;

    case FungibleConditionCode.GreaterEqual:
      return `${sender} will transfer at least`;

    case FungibleConditionCode.Less:
      return `${sender} will transfer less than`;

    case FungibleConditionCode.LessEqual:
      return `${sender} will transfer at most`;

    case NonFungibleConditionCode.DoesNotOwn:
      return `${sender} will transfer`;

    case NonFungibleConditionCode.Owns:
      return `${sender} will keep or receive`;
  }
}
