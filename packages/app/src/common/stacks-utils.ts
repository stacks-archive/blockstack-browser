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
  ChainID,
} from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { c32addressDecode } from 'c32check';
import { getAssetStringParts } from '@stacks/ui-utils';
import { Network } from '@store/recoil/networks';
import { STX_DECIMALS } from './constants';

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
  const stxString = fixedDecimals
    ? stacks.toFormat(STX_DECIMALS)
    : stacks.decimalPlaces(STX_DECIMALS).toFormat();
  return `${stxString}${withTicker ? ' STX' : ''}`;
};

export const microStxToStx = (mStx: number | string) => {
  const microStacks = new BigNumber(mStx);
  const stacks = microStacks.shiftedBy(-STX_DECIMALS);
  return stacks;
};

export const stxToMicroStx = (stx: number | string) => {
  const stxBN = new BigNumber(stx);
  const micro = stxBN.shiftedBy(STX_DECIMALS);
  return micro;
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
    if (pc.conditionCode === NonFungibleConditionCode.DoesNotOwn) return 'do not own';
    if (pc.conditionCode === NonFungibleConditionCode.Owns) return 'own';
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

export function validateAddressChain(address: string, currentNetwork: Network) {
  const prefix = address.substr(0, 2);
  if (currentNetwork.chainId === ChainID.Testnet) {
    return prefix === 'SN' || prefix === 'ST';
  }
  if (currentNetwork.chainId === ChainID.Mainnet) {
    return prefix === 'SM' || prefix === 'SP';
  }
  return false;
}

export const getTicker = (assetName: string) => {
  return assetName.slice(0, 3).toUpperCase();
};
