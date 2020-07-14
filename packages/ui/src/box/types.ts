import * as StyledSystem from 'styled-system';
import * as React from 'react';
import { LiteralUnion } from 'type-fest';
import * as CSS from 'csstype';

import { Omit } from '../common-types';
import typography, { TextStylesLiteral } from '../theme/typography';
import { SpacingProps } from '../theme/types';
import { shadows } from '../theme/theme';

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

export type FontWeightValues = keyof typeof typography.fontWeights;

export interface FontSize {
  fontSize?: StyledSystem.ResponsiveValue<FontSizeValues> | StyledSystem.FontSizeProps['fontSize'];
}

export interface FontWeight {
  fontWeight?:
    | StyledSystem.ResponsiveValue<FontWeightValues>
    | StyledSystem.FontWeightProps['fontWeight'];
}

export type LineHeightValues = keyof typeof typography.lineHeights;

export interface LineHeight {
  lineHeight?:
    | StyledSystem.ResponsiveValue<LineHeightValues>
    | StyledSystem.LineHeightProps['lineHeight'];
}

export type LetterSpacingValues = keyof typeof typography.letterSpacings;

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

export interface TextStyle {
  textStyle?: StyledSystem.ResponsiveValue<LiteralUnion<TextStylesLiteral, string>>;
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

export type BoxShadow = LiteralUnion<keyof typeof shadows, CSS.BoxShadowProperty>;

export interface OtherProps {
  children?: React.ReactNode[] | React.ReactNode;
  cursor?: CSS.CursorProperty | StyledSystem.ResponsiveValue<CSS.CursorProperty>;
  transform?: CSS.TransformProperty | StyledSystem.ResponsiveValue<CSS.TransformProperty>;
  transition?: CSS.TransitionProperty | StyledSystem.ResponsiveValue<CSS.TransitionProperty>;
  boxShadow?: BoxShadow | StyledSystem.ResponsiveValue<BoxShadow>;
  pointerEvents?:
    | CSS.PointerEventsProperty
    | StyledSystem.ResponsiveValue<CSS.PointerEventsProperty>;
  outline?: CSS.OutlineProperty<any> | StyledSystem.ResponsiveValue<CSS.OutlineProperty<any>>;
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

export type BoxPropsBase = StyledSystemProps &
  ModifiedStyledSystemProps &
  ShorthandProps &
  As &
  BoxHTMLProps &
  SpacingProps;

export type Box = React.FC<BoxPropsBase>;

export type PropsOf<T extends AsType> = React.ComponentPropsWithRef<T>;

/**
 * Remove as from the types accepted in pseudo styles
 */
type BoxSystemProps = Omit<BoxPropsBase, 'as'>;

export interface BoxProps extends BoxPropsBase {
  /**
   * Styles for CSS selector `&:after`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <PseudoBox _after={{content:`""` }}/>
   * ```
   */
  _after?: BoxSystemProps;
  /**
   * Styles for CSS selector `&:before`
   *
   * NOTE:When using this, ensure the `content` is wrapped in a backtick.
   * @example
   * ```jsx
   * <PseudoBox _before={{content:`""` }}/>
   * ```
   */
  _before?: BoxSystemProps;
  /**
   * Styles for CSS selector `&:focus`
   */
  _focus?: BoxSystemProps;
  /**
   * Styles for CSS selector `&:hover`
   */
  _hover?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:active`
   */
  _active?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&[aria-pressed=true]`
   * Typically used to style the current "pressed" state of toggle buttons
   */
  _pressed?: BoxSystemProps;
  /**
   * Styles to apply when the ARIA attribute `aria-selected` is `true`
   * - CSS selector `&[aria-selected=true]`
   */
  _selected?: BoxSystemProps;
  /**
   * Styles to apply when a child of this element has received focus
   * - CSS Selector `&:focus-within`
   */
  _focusWithin?: BoxSystemProps;

  /**
   * Styles to apply when the ARIA attribute `aria-invalid` is `true`
   * - CSS selector `&[aria-invalid=true]`
   */
  _invalid?: BoxSystemProps;
  /**
   * Styles to apply when this element is disabled. The passed styles are applied to these CSS selectors:
   * - `&[aria-disabled=true]`
   * - `&:disabled`
   * - `&:disabled:focus`
   * - `&:disabled:hover`
   * - `&:focus[aria-disabled=true]`
   * - `&:hover[aria-disabled=true]`
   */
  _disabled?: BoxSystemProps;
  /**
   * Styles to apply when the ARIA attribute `aria-grabbed` is `true`
   * - CSS selector `&[aria-grabbed=true]`
   */
  _grabbed?: BoxSystemProps;
  /**
   * Styles to apply when the ARIA attribute `aria-expanded` is `true`
   * - CSS selector `&[aria-expanded=true]`
   */
  _expanded?: BoxSystemProps;
  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `true`
   * - CSS selector `&[aria-checked=true]`
   */
  _checked?: BoxSystemProps;
  /**
   * Styles to apply when the ARIA attribute `aria-checked` is `mixed`
   * - CSS selector `&[aria-checked=mixed]`
   */
  _mixed?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:nth-child(odd)`
   */
  _odd?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:nth-child(even)`
   */
  _even?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:visited`
   */
  _visited?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:readonly`
   */
  _readOnly?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:first-of-type`
   */
  _first?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:last-of-type`
   */
  _last?: BoxSystemProps;
  /**
   * Styles to apply when you hover on a parent that has `role=group`.
   */
  _groupHover?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:not(:first-of-type)`
   */
  _notFirst?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&:not(:last-of-type)`
   */
  _notLast?: BoxSystemProps;
  /**
   * Styles for CSS Selector `&::placeholder`.
   * Useful for inputs
   */
  _placeholder?: BoxSystemProps;
}
