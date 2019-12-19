import { createGlobalStyle } from 'styled-components';
import preflight from './preflight';
import { theme } from '../theme';
import typography from '../theme/typography';

// Should type as theme here, however this type
// has optional properties. Need to enforce type to ensure
// these values are defined
const defaultConfig = (theme: any) => ({
  light: {
    color: theme.colors.ink[900],
    bg: undefined as any,
    borderColor: '#E5E5EC', // TODO: replace this with theme color
    placeholderColor: theme.colors.ink[400],
  },
  dark: {
    color: 'white',
    bg: theme.colors.ink[900],
    borderColor: theme.colors.ink[600],
    placeholderColor: theme.colors.ink[500],
  },
});

const { color, bg, borderColor, placeholderColor } = defaultConfig(theme).light;

const CSSReset = createGlobalStyle`
  ${preflight};
  html {
    line-height: 1.5;
    color: ${color};
    background-color: ${bg};
    font-family: ${typography.fonts.body};
  }

  /**
  * Allow adding a border to an element by just adding a border-width.
  */

  *,
  *::before,
  *::after {
    border-width: 0;
    border-style: solid;
    border-color: ${borderColor};
  }

  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: ${placeholderColor};
  }

  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color: ${placeholderColor};
  }

  input::placeholder,
  textarea::placeholder {
    color: ${placeholderColor};
  }
`;

export { CSSReset };
