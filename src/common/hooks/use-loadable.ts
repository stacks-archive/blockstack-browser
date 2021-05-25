import { useEffect, useState } from 'react';
import { useRecoilValueLoadable, RecoilValue } from 'recoil';

/**
 * Wrap a Recoil loadable and add a `value` property, which
 * returns the latest value if the loadable is revalidating.
 */
export const useLoadable = <T>(recoilValue: RecoilValue<T>) => {
  const loadable = useRecoilValueLoadable(recoilValue);
  const [value, setValue] = useState<T | undefined>(loadable.valueMaybe() || undefined);

  useEffect(() => {
    if (loadable.state === 'hasValue' && loadable.contents !== value) {
      setValue(loadable.contents);
    }
  }, [loadable, value]);

  return {
    ...loadable,
    key: recoilValue.key,
    value,
    isLoading: !value && loadable.state === 'loading',
  };
};
