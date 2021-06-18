import { Atom } from 'jotai';
import { ContractPrincipal } from '@store/assets/types';

export function debugLabelWithContractPrincipal(
  atom: Atom<any>,
  key: string,
  contractPrincipal: ContractPrincipal & { networkUrl: string }
) {
  atom.debugLabel = `${key}/${contractPrincipal.networkUrl}/${contractPrincipal.contractAddress}.${contractPrincipal.contractName}`;
}
