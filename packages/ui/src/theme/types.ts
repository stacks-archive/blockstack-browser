import { Theme as StyledSystemTheme } from 'styled-system';

interface CustomTheme {
  opacity?: {
    [key: string]: string;
  };
  textStyles?: any;
  fonts: {
    [key: string]: string;
  };
}

export type Theme = StyledSystemTheme & CustomTheme;
