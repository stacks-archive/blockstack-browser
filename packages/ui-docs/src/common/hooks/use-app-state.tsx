import React from 'react';
import { AppStateContext } from '@components/app-state/context';
import { State } from '@components/app-state/types';

interface UseAppStateReturn extends State {
  doChangeActiveSlug: (activeSlug: string) => void;
  doChangeSlugInView: (slugInView: string) => void;
  doSetVersion: (version: string) => void;
}

export const useAppState = (): UseAppStateReturn => {
  const { setState, ...rest } = React.useContext(AppStateContext);

  function setter<T>(key: string) {
    return (value: T) =>
      setState((state: State) => ({
        ...state,
        [key]: value,
      }));
  }

  const doSetVersion = setter<string>('version');

  const doChangeActiveSlug = setter<string>('activeSlug');

  const doChangeSlugInView = setter<string>('slugInView');

  return {
    ...rest,
    doChangeActiveSlug,
    doChangeSlugInView,
    setState,
    doSetVersion,
  };
};
