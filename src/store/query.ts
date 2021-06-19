import { atomFamily } from 'jotai/utils';
import { atomWithQuery, queryClientAtom } from 'jotai/query';
import deepEqual from 'fast-deep-equal';

import type { Getter, WritableAtom } from 'jotai';
import type { QueryObserverOptions } from 'react-query';
import { atom } from 'jotai';

export const queryAtom = <Data>(
  key: string,
  queryFn: (get: Getter) => Data | Promise<Data>,
  options: {
    equalityFn?: (a: Data, b: Data) => boolean;
  } & QueryObserverOptions = {}
) => {
  const { equalityFn = deepEqual } = options;
  const dataAtom = atomWithQuery(
    get => ({
      queryKey: key,
      queryFn: () => queryFn(get),
      keepPreviousData: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }),
    equalityFn
  );
  dataAtom.debugLabel = `queryAtom/${key}`;
  return dataAtom;
};

export const atomFamilyWithQuery = <Param, Data>(
  key: string,
  queryFn: (get: Getter, param: Param) => Data | Promise<Data>,
  options: {
    equalityFn?: (a: Data, b: Data) => boolean;
  } & QueryObserverOptions = {}
): ((param: Param) => WritableAtom<Data, null>) => {
  const { equalityFn = deepEqual, ...rest } = options;
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
        ...(rest as any), // TODO: fix type cast
      };
    }, equalityFn);
    dataAtom.debugLabel = `atomFamilyWithQuery/dataAtom/${JSON.stringify(queryKey)}`;

    const anAtom = atom(
      get => get(dataAtom),
      async get => {
        const queryClient = get(queryClientAtom);
        await queryClient.refetchQueries({
          queryKey,
        });
      }
    );
    anAtom.debugLabel = `atomFamilyWithQuery/${JSON.stringify(queryKey)}`;
    return anAtom;
  }, deepEqual);
};
