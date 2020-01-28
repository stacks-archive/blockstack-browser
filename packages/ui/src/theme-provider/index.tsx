import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import React, { useContext } from 'react';
import { theme, Theme } from '../theme';

export const ThemeContext = React.createContext(theme);

const ThemeProvider: React.FC<{ theme: Theme; children: any }> = ({ theme, children }) => (
  <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>
);

ThemeProvider.defaultProps = {
  theme,
};

const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (theme === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

export { useTheme, ThemeProvider };
