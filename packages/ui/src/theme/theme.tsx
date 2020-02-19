import colors from './colors';
import sizes, { baseSizes } from './sizes';
import typography from './typography';
import { Theme } from './types';

const space = baseSizes;

export const shadows = {
  low: '0px 1px 2px rgba(0, 0, 0, 0.04)',
  mid: '0px 1px 2px rgba(27, 39, 51, 0.04), 0px 4px 8px rgba(27, 39, 51, 0.04)',
  high: '0px 8px 16px rgba(27, 39, 51, 0.08)',
  inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
  none: 'none',
  focus: '0 0 0 3px rgba(170, 179, 255, 0.75)',
  'button.secondary': '0px 1px 2px rgba(0, 0, 0, 0.08), 0px 1px 4px rgba(0, 0, 0, 0.08)',
};

type Breakpoints = string[] & {
  [key: string]: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
};

// Type must be coerced here to support type `string[]` with custom properties
const breakpoints = ['30em', '48em', '62em', '80em'] as Breakpoints;
// aliases
breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];

const zIndices: Theme['zIndices'] = {
  hide: -1,
  auto: 'auto',
  '0': 0,
  '10': 10,
  '20': 20,
  '30': 30,
  '40': 40,
  '50': 50,
  '60': 60,
  '70': 70,
  '80': 80,
};

const radii = {
  none: '0',
  sm: '0.125rem',
  md: '0.25rem',
  lg: '0.5rem',
  full: '9999px',
};

const opacity = {
  '0': '0',
  '20%': '0.2',
  '40%': '0.4',
  '60%': '0.6',
  '80%': '0.8',
  '100%': '1',
};

const borders = {
  none: 0,
  '1px': '1px solid',
  '2px': '2px solid',
  '4px': '4px solid',
};

const theme: Theme = {
  breakpoints,
  zIndices,
  radii,
  opacity,
  borders,
  colors,
  ...(typography as any),
  sizes,
  shadows,
  space,
};

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';

export { theme };
