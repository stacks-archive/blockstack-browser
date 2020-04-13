import * as StyledSystem from 'styled-system';
import * as React from 'react';
import { Omit } from '../common-types';
import * as CSS from 'csstype';
import { SystemStyleObject } from '@styled-system/css';

export type FontSizeValues =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

export type FontWeightValues =
  | 'hairline'
  | 'thin'
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black';

export interface FontSize {
  fontSize?: StyledSystem.ResponsiveValue<FontSizeValues> | StyledSystem.FontSizeProps['fontSize'];
}

export interface FontWeight {
  fontWeight?:
    | StyledSystem.ResponsiveValue<FontWeightValues>
    | StyledSystem.FontWeightProps['fontWeight'];
}

export type LineHeightValues = 'none' | 'shorter' | 'short' | 'normal' | 'tall' | 'taller';

export interface LineHeight {
  lineHeight?:
    | StyledSystem.ResponsiveValue<LineHeightValues>
    | StyledSystem.LineHeightProps['lineHeight'];
}

export type LetterSpacingValues = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

export interface LetterSpacing {
  letterSpacing?:
    | StyledSystem.ResponsiveValue<LetterSpacingValues>
    | StyledSystem.LetterSpacingProps['letterSpacing'];
}

export interface TextAlign {
  textAlign?:
    | StyledSystem.ResponsiveValue<CSS.TextAlignProperty>
    | StyledSystem.TextAlignProps['textAlign'];
}

export interface TextDecoration {
  textDecoration?:
    | StyledSystem.ResponsiveValue<CSS.TextDecorationProperty<any>>
    | CSS.TextDecorationProperty<any>;
}

export interface TextTransform {
  textTransform?:
    | StyledSystem.ResponsiveValue<CSS.TextTransformProperty>
    | CSS.TextTransformProperty;
}

export type TextStyleValues =
  | 'display.large'
  | 'display.small'
  | 'body.large.medium'
  | 'body.large'
  | 'body.small.medium'
  | 'body.small'
  | 'caption'
  | 'caption.medium';

export interface TextStyle {
  textStyle?:
    | StyledSystem.ResponsiveValue<TextStyleValues>
    | StyledSystem.TextStyleProps['textStyle'];
}

export type AsType = React.ElementType<any>;

export interface As {
  as?: AsType;
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
  | 'textTransform'
> &
  WhiteSpace;

export interface FlexDirectionShorthandProps {
  flexDir?: StyledSystem.FlexDirectionProps['flexDirection'];
}

export interface DisplayShorthandProps {
  d?: StyledSystem.DisplayProps['display'];
}

export type BoxShadow = 'low' | 'mid' | 'high' | 'inner' | 'none' | CSS.BoxShadowProperty;

export interface OtherProps {
  cursor?: CSS.CursorProperty | StyledSystem.ResponsiveValue<CSS.CursorProperty>;
  transform?: CSS.TransformProperty | StyledSystem.ResponsiveValue<CSS.TransformProperty>;
  transition?: CSS.TransitionProperty | StyledSystem.ResponsiveValue<CSS.TransitionProperty>;
  boxShadow?: BoxShadow | StyledSystem.ResponsiveValue<BoxShadow>;
  children?: React.ReactNode[] | React.ReactNode;
  sx?: SystemStyleObject;
}

export type ShorthandProps = FlexDirectionShorthandProps & DisplayShorthandProps;

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
  FontSize &
  LetterSpacing &
  TextAlign &
  TextStyle &
  FontWeight &
  LineHeight &
  TextDecoration &
  TextTransform &
  OtherProps;

export type BoxHTMLProps = React.RefAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLDivElement>;

export type BoxProps = StyledSystemProps &
  ModifiedStyledSystemProps &
  ShorthandProps &
  As &
  BoxHTMLProps;

export type Box = React.FC<BoxProps>;

export type PropsOf<T extends AsType> = React.ComponentPropsWithRef<T>;
