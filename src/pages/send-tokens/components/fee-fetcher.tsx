import { useCurrentFee } from '@common/hooks/use-current-fee';

interface FeeFetcherProps {
  children(fee: number): JSX.Element;
}
export function FeeFetcher({ children }: FeeFetcherProps) {
  const fee = useCurrentFee();
  return children(fee);
}
