import { useEffect, useState } from 'react';
import { useRecoilValueLoadable, RecoilValue } from 'recoil';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

/**
 * Wrap a Recoil loadable and add a `value` property, which
 * returns the latest value if the loadable is revalidating.
 */
export const useLoadable = <T>(recoilValue: RecoilValue<T>) => {
  const loadable = useRecoilValueLoadable(recoilValue);
  const network = useCurrentNetwork();
  const [value, setValue] = useState<T | undefined>(loadable.valueMaybe() || undefined);

  useEffect(() => {
    if (loadable.state === 'hasValue' && loadable.contents !== value) {
      setValue(loadable.contents);
    }
  }, [loadable, value]);

  useEffect(() => {
    // we want to revalidate on network change
    setValue(undefined);
  }, [network.url]);

  return {
    ...loadable,
    key: recoilValue.key,
    value,
    isLoading: !value && loadable.state === 'loading',
  };
};
