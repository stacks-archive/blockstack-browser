import { useCurrentFee } from '@common/hooks/use-current-fee';

export function useFeeWithDefault() {
  const fee = useCurrentFee();
  return fee ?? 1;
}
