import React from 'react';

import { State } from '@components/app-state/types';

export const initialState: State = {
  mobileMenu: false,
  activeSlug: '',
  version: '',
  setState: (value: any) => null,
};
export const AppStateContext = React.createContext<State>(initialState);
