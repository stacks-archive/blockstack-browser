import * as StyledSystem from 'styled-system';
import * as React from 'react';
import { Omit } from '../common-types';
import * as CSS from 'csstype';

export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

export type FontWeight =
  | 'hairline'
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export interface IFontSize {
  fontSize?: StyledSystem.ResponsiveValue<FontSize> | StyledSystem.FontSizeProps['fontSize'];
}

export interface IFontWeight {
  fontWeight?: StyledSystem.ResponsiveValue<FontWeight> | StyledSystem.FontWeightProps['fontWeight'];
}

export type LineHeight = 'none' | 'shorter' | 'short' | 'normal' | 'tall' | 'taller';

export interface ILineHeight {
  lineHeight?: StyledSystem.ResponsiveValue<LineHeight> | StyledSystem.LineHeightProps['lineHeight'];
}

export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export interface ILetterSpacing {
  letterSpacing?: StyledSystem.ResponsiveValue<LetterSpacing> | StyledSystem.LetterSpacingProps['letterSpacing'];
}

export interface ITextAlign {
  textAlign?: StyledSystem.ResponsiveValue<CSS.TextAlignProperty> | StyledSystem.TextAlignProps['textAlign'];
}

export interface ITextDecoration {
  textDecoration?: StyledSystem.ResponsiveValue<CSS.TextDecorationProperty> | CSS.TextDecorationProperty;
}

export type TextStyle =
  | 'display.large'
  | 'display.small'
  | 'body.large.medium'
  | 'body.large'
  | 'body.small.medium'
  | 'body.small'
  | 'caption'
  | 'caption.medium';

export interface ITextStyle {
  textStyle?: StyledSystem.ResponsiveValue<TextStyle> | StyledSystem.TextStyleProps['textStyle'];
}

export interface IAs {
  as?: React.ElementType;
}

export interface WhiteSpace {
  whiteSpace?: StyledSystem.ResponsiveValue<CSS.WhiteSpaceProperty>;
}

export type TypographyProps = Omit<
  StyledSystem.TypographyProps,
  | 'fontWeight'
  | 'lineHeight'
  | 'fontSize'
  | 'letterSpacing'
  | 'textAlign'
  | 'textStyle'
  | 'whiteSpace'
  | 'textDecoration'
> &
  WhiteSpace;

export interface IFlexDirectionShorthandProps {
  flexDir?: StyledSystem.FlexDirectionProps['flexDirection'];
}

export interface IDisplayShorthandProps {
  d?: StyledSystem.DisplayProps['display'];
}

export type BoxShadow = 'low' | 'mid' | 'high' | 'inner' | 'none' | CSS.BoxShadowProperty;

export interface IOtherProps {
  cursor?: CSS.CursorProperty | StyledSystem.ResponsiveValue<CSS.CursorProperty>;
  transform?: CSS.TransformProperty | StyledSystem.ResponsiveValue<CSS.TransformProperty>;
  transition?: CSS.TransitionProperty | StyledSystem.ResponsiveValue<CSS.TransitionProperty>;
  boxShadow?: BoxShadow | StyledSystem.ResponsiveValue<BoxShadow>;
}

export type ShorthandProps = IFlexDirectionShorthandProps & IDisplayShorthandProps;

export type StyledSystemProps = StyledSystem.LayoutProps &
  StyledSystem.ColorProps &
  StyledSystem.SpaceProps &
  StyledSystem.BordersProps &
  StyledSystem.BackgroundProps &
  StyledSystem.PositionProps &
  StyledSystem.FlexboxProps &
  StyledSystem.ShadowProps &
  StyledSystem.GridProps &
  StyledSystem.OpacityProps &
  StyledSystem.OverflowProps;

export type ModifiedStyledSystemProps = TypographyProps &
  IFontSize &
  ILetterSpacing &
  ITextAlign &
  ITextStyle &
  IFontWeight &
  ILineHeight &
  ITextDecoration &
  IOtherProps;

export type BoxHTMLProps = React.RefAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>;

export type BoxProps = StyledSystemProps & ModifiedStyledSystemProps & ShorthandProps & IAs & BoxHTMLProps;

export type Box = React.FC<BoxProps>;
