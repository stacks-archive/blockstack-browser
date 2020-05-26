import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import React from 'react';
import { theme as defaultTheme, Theme } from '../theme';

export const ThemeContext = React.createContext(defaultTheme);

const ThemeProvider: React.FC<{ theme: Theme; children: any }> = ({
  theme = defaultTheme,
  children,
}) => <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>;

export { ThemeProvider };
