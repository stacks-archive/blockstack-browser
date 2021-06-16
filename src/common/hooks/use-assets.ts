import {
  assetsState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/assets/tokens';
import { useAtomValue } from 'jotai/utils';
import { useMemo } from 'react';

export const useAssets = () => {
  return useAtomValue(assetsState);
};

export const useTransferableAssets = () => {
  return useAtomValue(transferableAssetsState);
};

export function useFungibleTokenState() {
  const atom = useMemo(() => fungibleTokensState, []);
  return useAtomValue(atom);
}

export function useNonFungibleTokenState() {
  const atom = useMemo(() => nonFungibleTokensState, []);
  return useAtomValue(atom);
}

export function useStxTokenState() {
  const atom = useMemo(() => stxTokenState, []);
  return useAtomValue(atom);
}
