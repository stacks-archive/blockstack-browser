import React from 'react';

import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';
import { useAtomValue } from 'jotai/utils';
import { getQueryClientAtom } from 'jotai/query';

export function Devtools() {
  const client = useAtomValue(getQueryClientAtom);
  return client ? (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools position={'top-left'} />
    </QueryClientProvider>
  ) : null;
}
