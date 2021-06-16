import { Atom } from 'jotai';
import { ContractPrincipal } from '@store/assets/types';

export function debugLabelWithContractPrincipal(
  atom: Atom<any>,
  key: string,
  contractPrincipal: ContractPrincipal
) {
  atom.debugLabel = `${key}/${contractPrincipal.contractAddress}.${contractPrincipal.contractName}`;
}
