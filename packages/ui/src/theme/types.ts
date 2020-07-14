import StyledSystem, {
  Theme as StyledSystemTheme,
  MarginProps as SSMarginProps,
} from 'styled-system';
import { LiteralUnion } from 'type-fest';

import { TextStylesLiteral } from './typography';
import { namedSpacingUnits } from './sizes';

interface CustomTheme {
  opacity?: {
    [key: string]: string;
  };
  textStyles?: TextStylesLiteral;
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

export type NamedSpacingLiteral = keyof typeof namedSpacingUnits;

export type Spacing = LiteralUnion<NamedSpacingLiteral, string | number>;

export type SpacingTypes = Spacing | Spacing[];

type MarginPropNames = keyof StyledSystem.MarginProps;
type PaddingPropNames = keyof StyledSystem.PaddingProps;

type Margins = LiteralUnion<NamedSpacingLiteral, string | number>;
type Paddings = LiteralUnion<NamedSpacingLiteral, string | number>;

type MarginProps = {
  [key in MarginPropNames]?: Margins | StyledSystem.ResponsiveValue<Margins>;
};

type PaddingProps = {
  [key in PaddingPropNames]?: Paddings | StyledSystem.ResponsiveValue<Paddings>;
};

export type SpacingProps = MarginProps & PaddingProps;
