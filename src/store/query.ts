import { Atom, Getter } from 'jotai';
import { atomFamily } from 'jotai/utils';
import { atomWithQuery } from 'jotai/query';
import deepEqual from 'fast-deep-equal';
import { QueryObserverOptions } from 'react-query';

const withInterval = (enabled: boolean) =>
  enabled
    ? {
        refetchInterval: 10000,
      }
    : {};

export const queryAtom = <Data>(
  key: string,
  queryFn: (get: Getter) => Data | Promise<Data>,
  enableInterval = false,
  equalityFn: (a: Data, b: Data) => boolean = Object.is
) => {
  const anAtom = atomWithQuery(
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
  anAtom.debugLabel = `queryAtom/${key}`;
  return anAtom;
};

export const atomFamilyWithQuery = <Param, Data>(
  key: string,
  queryFn: (get: Getter, param: Param) => Promise<Data>,
  options: {
    enableInterval?: boolean;
    equalityFn?: (a: Data, b: Data) => boolean;
    onError?: QueryObserverOptions['onError'];
  } = {}
): ((param: Param) => Atom<Data>) => {
  const { enableInterval = false, equalityFn = deepEqual } = options;
  return atomFamily(param => {
    const anAtom = atomWithQuery(
      get => ({
        queryKey: [key, param],
        queryFn: () => queryFn(get, param),
        useErrorBoundary: true,
        keepPreviousData: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        ...withInterval(enableInterval),
      }),
      equalityFn
    );
    anAtom.debugLabel = `atomFamilyWithQuery/${key}`;
    return anAtom;
  }, deepEqual);
};
