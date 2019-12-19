import { Theme as StyledSystemTheme } from 'styled-system';

interface CustomTheme {
  opacity?: {
    [key: string]: string;
  };
  textStyles?: any;
}

export type Theme = StyledSystemTheme & CustomTheme;
