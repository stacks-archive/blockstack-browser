import { useLoadable } from '@common/hooks/use-loadable';
import {
  assetsState,
  fungibleTokensState,
  nonFungibleTokensState,
  stxTokenState,
  transferableAssetsState,
} from '@store/tokens';

export const useAssets = () => {
  return useLoadable(assetsState);
};

export const useTransferableAssets = () => {
  return useLoadable(transferableAssetsState);
};

export function useFungibleTokenState() {
  return useLoadable(fungibleTokensState);
}

export function useNonFungibleTokenState() {
  return useLoadable(nonFungibleTokensState);
}

export function useStxTokenState() {
  return useLoadable(stxTokenState);
}
