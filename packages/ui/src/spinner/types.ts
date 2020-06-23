import { BoxProps } from '../box';
import { LiteralUnion } from 'type-fest';

export enum SpinnerSizes {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

export type NamedSizeLiterals = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type SpinnerSize = LiteralUnion<NamedSizeLiterals, string>;

export interface SpinnerPropsBase {
  /**
   * The size of the spinner
   */
  size?: SpinnerSize;
  /**
   * The color of the empty area in the spinner
   */
  emptyColor?: string;
  /**
   * The color of the spinner
   */
  color?: string;
  /**
   * The thickness of the spinner
   * @example
   * ```jsx
   * <Spinner thickness="4px"/>
   * ```
   */
  thickness?: string;
  /**
   * The speed of the spinner.
   * @example
   * ```jsx
   * <Spinner speed="0.2s"/>
   * ```
   */
  speed?: string;
  /**
   * For accessibility, it's important to add a fallback loading text.
   * This text will be visible to screen readers.
   */
  label?: string;
}

export type SpinnerProps = BoxProps & SpinnerPropsBase;
