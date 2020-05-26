import React from 'react';
import { AppStateContext } from '@components/app-state/context';
import { State } from '@components/app-state/types';

export const useAppState = (): State => React.useContext(AppStateContext);
