import * as React from 'react';
import * as StyledSystem from 'styled-system';
import { PseudoBoxProps } from '../pseudo-box/types';

/**
 * The size of the button
 */
export type ButtonSizes = 'sm' | 'md' | 'lg';
/**
 * The color scheme of the button variant. Use the color keys passed in `theme.colors`.
 */
export type ButtonColorVariants = string;
/**
 * The variant of the button style to use.
 */
export type ButtonVariants = 'outline' | 'unstyled' | 'link' | 'solid';
/**
 * The mode of the button style to use.
 */
export type ButtonModes = 'primary' | 'secondary';

export interface CustomStyles {
  primary: PseudoBoxProps;
  secondary: PseudoBoxProps;
}

interface IButtonPropsBase {
  size?: ButtonSizes;
  isLoading?: boolean;
  variantColor?: ButtonColorVariants;
  variant?: ButtonVariants;
  mode?: ButtonModes;
  customStyles?: CustomStyles;
  /**
   * If `true`, the button will be styled in it's active state.
   */
  isActive?: boolean;
  /**
   * If `true`, the button will be disabled.
   */
  isDisabled?: boolean;
  /**
   * The label to show in the button when `isLoading` is true
   * If no text is passed, it only shows the spinner
   */
  loadingText?: string;
  /**
   * If `true`, the button will take up the full width of its container.
   */
  isFullWidth?: boolean;
  /**
   * The html button type to use.
   */
  type?: 'button' | 'reset' | 'submit';
  /**
   * The content of the button.
   */
  children: React.ReactNode;
  /**
   * If added, the button will show an icon before the button's label.
   * Use the icon key in `theme.iconPath`
   */
  leftIcon?: string;
  /**
   * If added, the button will show an icon after the button's label.
   * Use the icon key in `theme.iconPath`
   */
  rightIcon?: string;
  /**
   * The space between the button icon and label.
   * Use the styled-system tokens or add custom values as a string
   */
  iconSpacing?: StyledSystem.MarginProps['margin'];
}

export interface IButtonStyles {
  variant: ButtonVariants;
  mode: ButtonModes;
  size: ButtonSizes;
  customStyles: CustomStyles;
}

export type ButtonProps = IButtonPropsBase &
  PseudoBoxProps &
  React.RefAttributes<HTMLButtonElement>;
