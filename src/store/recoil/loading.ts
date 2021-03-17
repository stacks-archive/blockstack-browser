import { atomFamily } from 'recoil';

export const loadingState = atomFamily<'idle' | 'loading', string>({
  key: 'ui.loading',
  default: () => 'idle',
});
