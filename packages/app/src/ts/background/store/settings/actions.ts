import { Action } from 'redux';

export type ThemeActionTypes = 'DARK_THEME' | 'LIGHT_THEME';

export type SettingsActions = Action<ThemeActionTypes>;

export const setDarkTheme = () => ({ type: 'DARK_THEME' });
export const setLightTheme = () => ({ type: 'LIGHT_THEME' });
