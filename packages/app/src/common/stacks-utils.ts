import { ContractCallArgument, ContractCallArgumentType } from '@blockstack/connect';
import {
  uintCV,
  intCV,
  falseCV,
  trueCV,
  contractPrincipalCV,
  standardPrincipalCV,
  bufferCV,
} from '@blockstack/stacks-transactions';
import RPCClient from '@blockstack/rpc-client';
import BigNumber from 'bignumber.js';

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

export const getRPCClient = () => {
  const { origin } = location;
  const url = origin.includes('localhost')
    ? 'http://localhost:3999'
    : 'https://sidecar.staging.blockstack.xyz';
  return new RPCClient(url);
};

export const stacksValue = ({
  value,
  fixedDecimals = false,
}: {
  value: number;
  fixedDecimals?: boolean;
}) => {
  const microStacks = new BigNumber(value);
  const stacks = microStacks.shiftedBy(-6);
  const stxString = fixedDecimals ? stacks.toFormat(6) : stacks.decimalPlaces(6).toFormat();
  return `${stxString} STX`;
};
