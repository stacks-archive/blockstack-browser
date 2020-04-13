import { Theme as StyledSystemTheme } from 'styled-system';

interface CustomTheme {
  opacity?: {
    [key: string]: string;
  };
  textStyles?: any;
  fonts: {
    [key: string]: string;
  };
}

export type Theme = StyledSystemTheme & CustomTheme;

export type RequiredTheme = Required<Theme>;

export type Responsive<T, ThemeType extends Theme = RequiredTheme> =
  | T
  | (T | null)[]
  | { [key in keyof ThemeType['breakpoints']]?: T };
