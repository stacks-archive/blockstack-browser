import React, { useCallback } from 'react';
import { createGlobalStyle } from 'styled-components';
import { themeGet } from '@styled-system/theme-get';
import { useMediaQuery } from '@common/hooks/use-media-query';
import { Theme } from '@blockstack/ui';
import { color } from '@common/utils';

export { color };

export const colorGet = (path: string, fallback?: string) => themeGet('colors.' + path, fallback);

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

export type ColorsStringLiteral =
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

const colorModeStyles = (props: { theme: Theme; colorMode: 'light' | 'dark' }) =>
  colors(props)[props.colorMode];

const colorMap = (props: { theme: Theme; colorMode: 'light' | 'dark' }) =>
  Object.keys(colors(props)[props.colorMode]);

export const ColorModes = createGlobalStyle`

:root{
${({ colorMode = 'light', ...rest }: any) =>
  colorMap({ colorMode, ...rest }).map(key => {
    return `--colors-${key}: ${
      //@ts-ignore
      colorModeStyles({ colorMode, ...rest })[key as string]
    };`;
  })}
}
  @media (prefers-color-scheme: dark) {
    :root {
    ${({ colorMode = 'light', ...rest }: any) =>
      colorMap({ colorMode, ...rest }).map(key => {
        return `--colors-${key}: ${
          //@ts-ignore
          colorModeStyles({ colorMode, ...rest })[key as string]
        };`;
      })}
    }
  }
  
  @media (prefers-color-scheme: light) {
    :root {
    ${({ colorMode = 'light', ...rest }: any) =>
      colorMap({ colorMode, ...rest }).map(key => {
        return `--colors-${key}: ${
          //@ts-ignore
          colorModeStyles({ colorMode, ...rest })[key as string]
        };`;
      })}
    }
  }
    
  html, body, #__next {
    background: var(--colors-bg);
    border-color: var(--colors-border);
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus,
  select:-webkit-autofill,
  select:-webkit-autofill:hover,
  select:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--colors-text-body);
    font-size: 16px !important;
    transition: background-color 5000s ease-in-out 0s;
  }
  
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: var(--colors-input-placeholder) !important;
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color:  var(--colors-input-placeholder) !important;
  }

  input::placeholder,
  textarea::placeholder {
    color:  var(--colors-input-placeholder) !important;
  }
  `;

export const ColorModeContext = React.createContext<{ colorMode?: string; toggleColorMode?: any }>({
  colorMode: undefined,
});

export const ColorModeProvider = ({
  colorMode,
  children,
}: {
  colorMode?: string;
  children: any;
}) => {
  const [mode, setMode] = React.useState(colorMode);
  const [darkmode] = useMediaQuery('(prefers-color-scheme: dark)');
  const [lightmode] = useMediaQuery('(prefers-color-scheme: light)');

  const setColorMode = useCallback(
    (mode: 'light' | 'dark') => {
      setMode(mode);
    },
    [mode]
  );

  const toggleColorMode = useCallback(() => {
    if (mode === 'light') {
      setColorMode('dark');
      return;
    }
    if (mode === 'dark') {
      setColorMode('light');
      return;
    }
    if (!colorMode && darkmode) {
      setColorMode('light');
      return;
    }
    if (!mode && lightmode) {
      setColorMode('dark');
      return;
    }
  }, [mode, lightmode, darkmode]);

  return (
    <ColorModeContext.Provider value={{ colorMode: mode, toggleColorMode }}>
      <ColorModes colorMode={mode} />
      {children}
    </ColorModeContext.Provider>
  );
};
