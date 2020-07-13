const typography = {
  letterSpacings: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  lineHeights: {
    normal: 'normal',
    none: '1',
    shorter: '1.333',
    short: '1.4',
    base: '1.5',
    tall: '1.625',
    taller: '2',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  fonts: {
    heading:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
  },
  fontSizes: [12, 14, 16, 20, 24, 28, 32, 36, 48, 64, 96, 128],
};

const displayLarge = {
  fontWeight: typography.fontWeights.semibold,
  fontSize: typography.fontSizes[4],
  lineHeight: typography.lineHeights.shorter, // 1.333
  letterSpacing: '-0.02em',
};
const displaySmall = {
  fontWeight: typography.fontWeights.medium,
  fontSize: typography.fontSizes[3],
  lineHeight: typography.lineHeights.short, // 1.4
  letterSpacing: '-0.02em',
};
const bodyLarge = {
  fontWeight: typography.fontWeights.normal,
  fontSize: typography.fontSizes[2],
  lineHeight: typography.lineHeights.base, // 1.5 (24)
  letterSpacing: '-0.01em',
};
const bodyLargeMedium = {
  ...bodyLarge,
  fontWeight: typography.fontWeights.medium,
};
const bodySmall = {
  fontWeight: typography.fontWeights.normal,
  fontSize: typography.fontSizes[1],
  lineHeight: typography.lineHeights.short, // 1.4 (19.6)
  letterSpacing: '-0.01em',
};
const bodySmallMedium = {
  ...bodySmall,
  fontWeight: typography.fontWeights.medium,
};
const caption = {
  fontSize: typography.fontSizes[0],
  lineHeight: typography.lineHeights.shorter, // 1.333 (16)
  letterSpacing: '0.00em',
};
const captionMedium = {
  ...bodySmall,
  fontWeight: typography.fontWeights.medium,
};

export const textStyles = {
  display: {
    large: {
      ...displayLarge,
      medium: bodyLargeMedium,
    },
    small: displaySmall,
  },
  body: {
    large: bodyLarge,
    small: {
      ...bodySmall,
      medium: bodySmallMedium,
    },
  },
  caption: {
    ...caption,
    medium: captionMedium,
  },
} as const;

export type TextStylesLiteral =
  | 'display.large'
  | 'display.small'
  | 'body.large'
  | 'body.large.medium'
  | 'body.small'
  | 'body.small.medium'
  | 'caption'
  | 'caption.medium';

export default {
  ...typography,
  textStyles,
};
