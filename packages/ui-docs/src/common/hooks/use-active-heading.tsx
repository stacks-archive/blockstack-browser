import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppState } from '@common/hooks/use-app-state';
import { State } from '@components/app-state/types';

interface ActiveHeadingProps {
  slug: string;
}
type ActiveHeadingReturn = [boolean, (value: any) => void];

export const useActiveHeading = ({ slug }: ActiveHeadingProps): ActiveHeadingReturn => {
  const router = useRouter();
  const state = useAppState();
  const { setState } = state;
  const { asPath } = router;

  useEffect(() => {
    if (
      asPath &&
      asPath.includes('#') &&
      asPath.split('#')[1] === slug &&
      state.activeSlug !== slug
    ) {
      setState((s: State) => ({ ...s, activeSlug: slug }));
    }
    if (asPath && !asPath.includes('#')) {
      setState((s: State) => ({ ...s, activeSlug: '' }));
    }
  }, [asPath]);

  const handleStateUpdate = useCallback(
    newSlug => setState((s: State) => ({ ...s, activeSlug: newSlug })),
    [state.activeSlug]
  );

  const selectActiveSlug = useCallback((state: State) => state && state.activeSlug, []);

  const isActive = selectActiveSlug(state) === slug;

  return [isActive, handleStateUpdate];
};
