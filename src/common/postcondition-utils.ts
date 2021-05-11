import {
  addressToString,
  FungibleConditionCode,
  NonFungibleConditionCode,
  PostCondition,
  PostConditionType,
} from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';

export const getIconStringFromPostCondition = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible)
    return `${addressToString(pc.assetInfo.address)}.${pc.assetInfo.contractName}.${
      pc.assetInfo.assetName.content
    }`;
  if (pc.conditionType === PostConditionType.STX) return 'STX';
  return pc.assetInfo.assetName.content;
};

export const getAmountFromPostCondition = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.Fungible) return pc.amount.toString();
  if (pc.conditionType === PostConditionType.STX)
    return stacksValue({ value: pc.amount.toString(), withTicker: false });
  return '';
};

export const getSymbolFromPostCondition = (pc: PostCondition) => {
  if ('assetInfo' in pc) {
    return pc.assetInfo.assetName.content.slice(0, 3).toUpperCase();
  }
  return 'STX';
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
      return `${sender} will not own`;

    case NonFungibleConditionCode.Owns:
      return `${sender} will own`;
  }
}
