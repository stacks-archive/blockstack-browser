import { createStore } from '@stencil/store';

export enum Screens {
  INTRO = 'INTRO',
  HOW_IT_WORKS = 'HOW_IT_WORKS',
  FINISHED = 'FINISHED',
}

interface AppState {
  screen: Screens;
}

export const { state } = createStore<AppState>({
  screen: Screens.INTRO,
});
