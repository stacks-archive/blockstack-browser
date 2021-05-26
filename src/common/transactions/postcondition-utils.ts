import {
  addressToString,
  FungibleConditionCode,
  NonFungibleConditionCode,
  parsePrincipalString,
  PostCondition,
  PostConditionType,
} from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';
import { postConditionFromString } from '@common/utils';
import { useTransferableAssets } from '@common/hooks/use-assets';

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
      return `${sender} will transfer`;

    case NonFungibleConditionCode.Owns:
      return `${sender} will keep or receive`;
  }
}

/**
 * This method will update a post conditions principal
 * value to the current address principal if and only if
 * the `stxAddress` value from the original tx payload
 * matches the address in the original post condition
 *
 * This is used when a user might switch accounts during
 * the signing process. One can assume that if the post
 * condition has the principal set to the same value as the
 * `stxAddress` value, it should be updated when they switch
 * accounts.
 */
export function handlePostConditions(
  postConditions: (PostCondition | string)[],
  payloadAddress: string,
  currentAddress: string
): PostCondition[] {
  const payloadPrincipal = parsePrincipalString(payloadAddress);
  const currentAddressPrincipal = parsePrincipalString(currentAddress);

  console.log('Setting up post conditions for transaction request');
  return postConditions.map((postCondition, index) => {
    const { principal, ...payload } = getPostCondition(postCondition);
    const sameType = payloadPrincipal.address.type === principal.address.type;
    const sameHash = payloadPrincipal.address.hash160 === principal.address.hash160;
    const isOriginatorAddress = sameHash && sameType;
    console.log(`[Post Conditions #${index + 1}]: address: ${addressToString(principal.address)}`);
    console.log(`[Post Conditions #${index + 1}]: isOriginatorAddress: ${isOriginatorAddress}`);
    return {
      ...payload,
      principal: isOriginatorAddress ? currentAddressPrincipal : principal,
    };
  });
}

export function getPostCondition(postCondition: string | PostCondition): PostCondition {
  return typeof postCondition === 'string' ? postConditionFromString(postCondition) : postCondition;
}

export function getPostConditions(
  postConditions?: (string | PostCondition)[]
): PostCondition[] | undefined {
  return postConditions?.map(getPostCondition);
}

export const getTitleFromFungibleConditionCode = (code: FungibleConditionCode) => {
  switch (code) {
    case FungibleConditionCode.Equal:
      return 'transfer exactly';
    case FungibleConditionCode.Greater:
      return 'transfer more than';
    case FungibleConditionCode.GreaterEqual:
      return 'transfer equal to or greater than';
    case FungibleConditionCode.Less:
      return 'transfer less than';
    case FungibleConditionCode.LessEqual:
      return 'transfer less than or equal to';
    default:
      return '';
  }
};
export const getPostConditionTitle = (pc: PostCondition) => {
  if (pc.conditionType === PostConditionType.STX || pc.conditionType === PostConditionType.Fungible)
    return getTitleFromFungibleConditionCode(pc.conditionCode);

  if (pc.conditionCode === NonFungibleConditionCode.DoesNotOwn) return 'will transfer';
  if (pc.conditionCode === NonFungibleConditionCode.Owns) return 'will keep';

  return '';
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
