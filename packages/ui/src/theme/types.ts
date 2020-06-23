import { Theme as StyledSystemTheme } from 'styled-system';
import { LiteralUnion } from 'type-fest';

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

export type NamedSpacingLiteral =
  | 'none'
  | 'extra-tight'
  | 'tight'
  | 'base-tight'
  | 'base'
  | 'base-loose'
  | 'loose'
  | 'extra-loose';

export type Spacing = LiteralUnion<NamedSpacingLiteral, string | number>;

export type SpacingTypes = Spacing | Spacing[];
