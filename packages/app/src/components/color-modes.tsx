import { Global, css } from '@emotion/react';
import React from 'react';

import { Theme } from '@stacks/ui-core';
import { theme } from '@stacks/ui';
import { themeGet } from '@styled-system/theme-get';
import { useColorMode } from '@common/hooks/use-color-mode';

export const colorGet = (path: string, fallback?: string): ((props: any) => any) =>
  themeGet('colors.' + path, fallback);

enum Color {
  Accent = 'accent',
  Bg = 'bg',
  BgAlt = 'bg-alt',
  BgLight = 'bg-light',
  Invert = 'invert',
  TextHover = 'text-hover',
  TextTitle = 'text-title',
  TextCaption = 'text-caption',
  TextBody = 'text-body',
  InputPlaceholder = 'input-placeholder',
  Border = 'border',
  FeedbackAlert = 'feedback-alert',
  FeedbackError = 'feedback-error',
  FeedbackSuccess = 'feedback-success',
}

type ColorsStringLiteral =
  | 'accent'
  | 'bg'
  | 'bg-alt'
  | 'bg-light'
  | 'invert'
  | 'text-hover'
  | 'text-title'
  | 'text-caption'
  | 'text-body'
  | 'input-placeholder'
  | 'border'
  | 'feedback-alert'
  | 'feedback-error'
  | 'feedback-success';

type ColorModeTypes = {
  [key in ColorsStringLiteral]: string;
};

interface ColorModesInterface {
  light: ColorModeTypes;
  dark: ColorModeTypes;
}

const colors = (props: { theme: Theme }): ColorModesInterface => ({
  light: {
    [Color.Accent]: colorGet('blue')(props),
    [Color.Bg]: 'white',
    [Color.BgAlt]: colorGet('ink.50')(props),
    [Color.BgLight]: colorGet('ink.50')(props),
    [Color.Invert]: colorGet('ink')(props),
    [Color.TextHover]: colorGet('blue')(props),
    [Color.TextTitle]: colorGet('ink')(props),
    [Color.TextCaption]: colorGet('ink.600')(props),
    [Color.TextBody]: colorGet('ink.900')(props),
    [Color.InputPlaceholder]: colorGet('ink.400')(props),
    [Color.Border]: colorGet('ink.200')(props),
    [Color.FeedbackAlert]: colorGet('orange')(props),
    [Color.FeedbackError]: colorGet('red')(props),
    [Color.FeedbackSuccess]: colorGet('green')(props),
  },
  dark: {
    [Color.Accent]: colorGet('blue.400')(props),
    [Color.Bg]: colorGet('ink')(props),
    [Color.BgAlt]: '#151616',
    [Color.BgLight]: '#1B1C1D',
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

const generateCssVariables = (mode: 'light' | 'dark') => ({ colorMode = mode, ...rest }: any) =>
  colorMap({ colorMode, ...rest }).map((key: ColorsStringLiteral) => {
    return `--colors-${key}: ${colorModeStyles({ colorMode, ...rest })[key]}`;
  });

export const LightMode = (
  <Global
    styles={css`
      :root {
        ${generateCssVariables('light')({ colorMode: 'light', theme })};
        --colors-highlight-line-bg: rgba(255, 255, 255, 0.08);
      }
    `}
  />
);

export const DarkMode = (
  <Global
    styles={css`
      :root {
        ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
        --colors-highlight-line-bg: rgba(255, 255, 255, 0.05);
      }
    `}
  />
);

export const Base = (
  <Global
    styles={css`
      * {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      html {
        background: var(--colors-bg);
        border-color: var(--colors-border);

        &.light {
          ${generateCssVariables('light')({ colorMode: 'light', theme })};
          --colors-highlight-line-bg: rgba(255, 255, 255, 0.08);
          * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        &.dark {
          ${generateCssVariables('dark')({ colorMode: 'dark', theme })};
          --colors-highlight-line-bg: rgba(255, 255, 255, 0.04);
          * {
            -webkit-font-smoothing: subpixel-antialiased;
            -moz-osx-font-smoothing: auto;
          }
          .metaverse-header {
            opacity: 0.6;
            //filter: brightness(1.3) contrast(0.7);
          }
        }
      }
    `}
  />
);

export const ColorModes = (
  <>
    <style
      data-emotion-css={`css-global ${DarkMode.props.styles.name}`}
      dangerouslySetInnerHTML={{ __html: DarkMode.props.styles.styles }}
      media="(prefers-color-scheme: dark)"
    />
    <style
      data-emotion-css={`css-global ${LightMode.props.styles.name}`}
      dangerouslySetInnerHTML={{ __html: LightMode.props.styles.styles }}
      media="(prefers-color-scheme: light)"
    />
    {Base}
  </>
);

export const ColorModeContext = React.createContext<{
  colorMode?: string;
  toggleColorMode?: any;
  setColorMode?: any;
}>({
  colorMode: undefined,
});

export const ColorModeProvider = React.memo(({ children }: { children: any }) => {
  const [colorMode, toggleColorMode, setColorMode] = useColorMode();

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
});
