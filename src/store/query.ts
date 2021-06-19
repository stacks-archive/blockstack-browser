import { atomFamily } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import deepEqual from 'fast-deep-equal';
import { QueryRefreshRates } from '@common/constants';

import type { Atom, Getter } from 'jotai';
import type { QueryObserverOptions } from 'react-query';

const withInterval = (enabled: boolean) =>
  enabled
    ? {
        refetchInterval: QueryRefreshRates.SLOW,
      }
    : {};

export const queryAtom = <Data>(
  key: string,
  queryFn: (get: Getter) => Data | Promise<Data>,
  enableInterval = false,
  equalityFn: (a: Data, b: Data) => boolean = Object.is
) => {
  const dataAtom = atomWithQuery(
    get => ({
      queryKey: key,
      queryFn: () => queryFn(get),
      keepPreviousData: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      ...withInterval(enableInterval),
    }),
    equalityFn
  );
  dataAtom.debugLabel = `queryAtom/${key}`;
  return dataAtom;
};

export const atomFamilyWithQuery = <Param, Data>(
  key: string,
  queryFn: (get: Getter, param: Param) => Promise<Data>,
  options: {
    enableInterval?: boolean;
    equalityFn?: (a: Data, b: Data) => boolean;
  } & QueryObserverOptions = {}
): ((param: Param) => Atom<Data>) => {
  const { enableInterval = false, equalityFn = deepEqual, ...rest } = options;
  return atomFamily(param => {
    const queryKey = [key, param];
    const dataAtom = atomWithQuery(get => {
      return {
        queryKey,

        queryFn: () => queryFn(get, param),
        useErrorBoundary: true,
        keepPreviousData: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        ...withInterval(enableInterval),
        ...(rest as any), // TODO: fix type cast
      };
    }, equalityFn);
    dataAtom.debugLabel = `atomFamilyWithQuery/${key}`;
    return dataAtom;
  }, deepEqual);
};
