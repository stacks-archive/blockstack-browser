// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { theme as uiTheme } from '@stacks/ui-theme';

export const theme = {
  ...uiTheme,
  colors: {
    ...uiTheme.colors,
    ink: {
      ...uiTheme.colors.ink,
      400: '#9C9CA2',
      1000: '#141416',
    },
  },
  fonts: {
    ...uiTheme.fonts,
    heading:
      '"Open Sauce", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};
