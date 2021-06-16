import { ChainID, createAssetInfo } from '@stacks/transactions';
import BigNumber from 'bignumber.js';
import { c32addressDecode } from 'c32check';
import { getAssetStringParts } from '@stacks/ui-utils';
import { Network, STX_DECIMALS } from './constants';
import { abbreviateNumber } from '@common/utils';

export const stacksValue = ({
  value,
  fixedDecimals = true,
  withTicker = true,
  abbreviate = false,
}: {
  value: number | string;
  fixedDecimals?: boolean;
  withTicker?: boolean;
  abbreviate?: boolean;
}) => {
  const stacks = microStxToStx(value);
  const stxAmount = stacks.toNumber();
  return `${
    abbreviate && stxAmount > 10000
      ? abbreviateNumber(stxAmount)
      : stxAmount.toLocaleString('en-US', {
          maximumFractionDigits: fixedDecimals ? STX_DECIMALS : 3,
        })
  }${withTicker ? ' STX' : ''}`;
};

export const microStxToStx = (mStx: number | string) => {
  const microStacks = new BigNumber(mStx);
  return microStacks.shiftedBy(-STX_DECIMALS);
};

export const ftDecimals = (value: number | string, decimals: number) => {
  const amount = new BigNumber(value);
  return amount
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};
export const ftUnshiftDecimals = (value: number | string, decimals: number) => {
  const amount = new BigNumber(value);
  return amount.shiftedBy(decimals).toString(10);
};

export const stxToMicroStx = (stx: number | string) => {
  const stxBN = new BigNumber(stx);
  return stxBN.shiftedBy(STX_DECIMALS);
};

export const validateStacksAddress = (stacksAddress: string): boolean => {
  try {
    c32addressDecode(stacksAddress);
    return true;
  } catch (e) {
    return false;
  }
};

export const makeAssetInfo = (assetIdentifier: string) => {
  const {
    address: contractAddress,
    contractName,
    assetName,
  } = getAssetStringParts(assetIdentifier);
  return createAssetInfo(contractAddress, contractName, assetName);
};

export function validateAddressChain(address: string, currentNetwork: Network) {
  const prefix = address.substr(0, 2);
  if (currentNetwork.chainId === ChainID.Testnet) return prefix === 'SN' || prefix === 'ST';
  if (currentNetwork.chainId === ChainID.Mainnet) return prefix === 'SM' || prefix === 'SP';
  return false;
}

export const getTicker = (assetName: string) => assetName.slice(0, 3).toUpperCase();
