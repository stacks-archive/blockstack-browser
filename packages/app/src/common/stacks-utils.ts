import { ContractCallArgument, ContractCallArgumentType } from '@stacks/connect';
import {
  uintCV,
  intCV,
  falseCV,
  trueCV,
  contractPrincipalCV,
  standardPrincipalCV,
  bufferCV,
  createAssetInfo,
  PostConditionType,
  PostCondition,
  FungibleConditionCode,
  NonFungibleConditionCode,
} from '@blockstack/stacks-transactions';
import BigNumber from 'bignumber.js';
import { Identity } from '@stacks/keychain';
import { c32addressDecode } from 'c32check';
import { getAssetStringParts } from '@stacks/ui-utils';

export const encodeContractCallArgument = ({ type, value }: ContractCallArgument) => {
  switch (type) {
    case ContractCallArgumentType.UINT:
      return uintCV(value);
    case ContractCallArgumentType.INT:
      return intCV(value);
    case ContractCallArgumentType.BOOL:
      if (value === 'false' || value === '0') return falseCV();
      else if (value === 'true' || value === '1') return trueCV();
      else throw new Error(`Unexpected Clarity bool value: ${JSON.stringify(value)}`);
    case ContractCallArgumentType.PRINCIPAL:
      if (value.includes('.')) {
        const [addr, name] = value.split('.');
        return contractPrincipalCV(addr, name);
      } else {
        return standardPrincipalCV(value);
      }
    case ContractCallArgumentType.BUFFER:
      return bufferCV(Buffer.from(value));
    default:
      throw new Error(`Unexpected Clarity type: ${type}`);
  }
};

export const stacksValue = ({
  value,
  fixedDecimals = false,
  withTicker = true,
}: {
  value: number | string;
  fixedDecimals?: boolean;
  withTicker?: boolean;
}) => {
  const stacks = microStxToStx(value);
  const stxString = fixedDecimals ? stacks.toFormat(6) : stacks.decimalPlaces(6).toFormat();
  return `${stxString}${withTicker ? ' STX' : ''}`;
};

export const microStxToStx = (mStx: number | string) => {
  const microStacks = new BigNumber(mStx);
  const stacks = microStacks.shiftedBy(-6);
  return stacks;
};

export const stxToMicroStx = (stx: number | string) => {
  const stxBN = new BigNumber(stx);
  const micro = stxBN.shiftedBy(6);
  return micro;
};

export function shortenHex(hex: string, length = 4) {
  return `${hex.substring(0, length + 2)}…${hex.substring(hex.length - length)}`;
}

/**
 * truncateMiddle
 *
 * @param {string} input - the string to truncate
 * @param {number} offset - the number of chars to keep on either end
 */
export const truncateMiddle = (input: string, offset = 5): string => {
  if (input.startsWith('0x')) {
    return shortenHex(input, offset);
  }
  const start = input?.substr(0, offset);
  const end = input?.substr(input.length - offset, input.length);
  return `${start}…${end}`;
};

export const getIdentityDisplayName = (identity: Identity, index: number): string => {
  if (identity.defaultUsername) {
    return identity.defaultUsername.split('.')[0];
  }
  return `Account ${index + 1}`;
};

export const validateStacksAddress = (stacksAddress: string): boolean => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

export const getFungibleTitle = (code: FungibleConditionCode) => {
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
  if (
    pc.conditionType === PostConditionType.STX ||
    pc.conditionType === PostConditionType.Fungible
  ) {
    return getFungibleTitle(pc.conditionCode);
  } else {
    if (pc.conditionCode === NonFungibleConditionCode.DoesNotOwn) return 'own';
    if (pc.conditionCode === NonFungibleConditionCode.Owns) return 'do not own';
  }
  return '';
};

export const makeAssetInfo = (assetIdentifier: string) => {
  const { address: contractAddress, contractName, assetName } = getAssetStringParts(
    assetIdentifier
  );
  const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
  return assetInfo;
};
