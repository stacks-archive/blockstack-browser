import { Theme } from '@blockstack/ui';
import {
  ColorModesInterface,
  ColorsStringLiteral,
  ColorModeTypes,
  Color,
  ThemeColorsStringLiteral,
} from './types';
import { themeGet } from '@styled-system/theme-get';

export const colorGet = (path: string, fallback?: string): ((props: any) => any) =>
  themeGet('colors.' + path, fallback);

const colors = (props: { theme: Theme }): ColorModesInterface => ({
  light: {
    [Color.Accent]: colorGet('blue')(props),
    [Color.Bg]: 'white',
    [Color.BgAlt]: colorGet('ink.50')(props),
    [Color.BgLight]: 'white',
    [Color.Invert]: colorGet('ink')(props),
    [Color.TextHover]: colorGet('blue')(props),
    [Color.TextTitle]: colorGet('ink')(props),
    [Color.TextCaption]: colorGet('ink.600')(props),
    [Color.TextBody]: colorGet('ink.900')(props),
    [Color.InputPlaceholder]: colorGet('ink.400')(props),
    [Color.Border]: 'rgb(229, 229, 236)',
    [Color.FeedbackAlert]: colorGet('orange')(props),
    [Color.FeedbackError]: colorGet('red')(props),
    [Color.FeedbackSuccess]: colorGet('green')(props),
  },
  dark: {
    [Color.Accent]: colorGet('blue.400')(props),
    [Color.Bg]: colorGet('ink')(props),
    [Color.BgAlt]: 'rgba(255,255,255,0.05)',
    [Color.BgLight]: 'rgba(255,255,255,0.08)',
    [Color.Invert]: 'white',
    [Color.TextHover]: colorGet('blue.300')(props),
    [Color.TextTitle]: 'white',
    [Color.TextCaption]: '#a7a7ad',
    [Color.TextBody]: colorGet('ink.300')(props),
    [Color.InputPlaceholder]: 'rgba(255,255,255,0.3)',
    [Color.Border]: 'rgb(39, 41, 46)',
    [Color.FeedbackAlert]: colorGet('orange')(props),
    [Color.FeedbackError]: colorGet('red')(props),
    [Color.FeedbackSuccess]: colorGet('green')(props),
  },
});

const colorModeStyles = (props: { theme: Theme; colorMode: 'light' | 'dark' }): ColorModeTypes =>
  colors(props)[props.colorMode];

const colorMap = (props: { theme: Theme; colorMode: 'light' | 'dark' }): ColorsStringLiteral[] =>
  Object.keys(colors(props)[props.colorMode]) as ColorsStringLiteral[];

export const color = (name: ColorsStringLiteral): string => {
  return `var(--colors-${name})`;
};

export const themeColor = (name: ThemeColorsStringLiteral): string => {
  return name;
};

export const generateCssVariables = (mode: 'light' | 'dark') => ({
  colorMode = mode,
  ...rest
}: any) =>
  colorMap({ colorMode, ...rest }).map((key: ColorsStringLiteral) => {
    return `--colors-${key}: ${colorModeStyles({ colorMode, ...rest })[key]};`;
  });
