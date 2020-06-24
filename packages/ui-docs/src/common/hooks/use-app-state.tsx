import React from 'react';
import { AppStateContext } from '@components/app-state/context';
import { State } from '@components/app-state/types';

interface UseAppStateReturn extends State {
  doChangeActiveSlug: (activeSlug: string) => void;
}

export const useAppState = (): UseAppStateReturn => {
  const { setState, ...rest } = React.useContext(AppStateContext);

  const doChangeActiveSlug = React.useCallback(
    (activeSlug: string) =>
      setState((state: State) => ({
        ...state,
        activeSlug,
      })),
    []
  );

  return {
    ...rest,
    doChangeActiveSlug,
    setState,
  };
};
