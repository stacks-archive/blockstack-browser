const typography = {
  letterSpacings: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  lineHeights: {
    normal: 'normal',
    none: '1',
    shorter: '1.333',
    short: '1.4',
    base: '1.5',
    tall: '1.625',
    taller: '2'
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
    black: 900
  },
  fonts: {
    heading:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: 'SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace'
  },
  fontSizes: [12, 14, 16, 20, 24, 28, 32, 36, 48, 64, 96, 128]
}

const textStyles = {
  display: {
    large: {
      fontWeight: typography.fontWeights.semibold,
      fontSize: typography.fontSizes[4],
      lineHeight: typography.lineHeights.shorter, // 1.333
      letterSpacing: '-0.02em'
    },
    small: {
      fontWeight: typography.fontWeights.medium,
      fontSize: typography.fontSizes[3],
      lineHeight: typography.lineHeights.short, // 1.4
      letterSpacing: '-0.02em'
    }
  },
  body: {
    large: {
      fontWeight: typography.fontWeights.normal,
      fontSize: typography.fontSizes[2],
      lineHeight: typography.lineHeights.base, // 1.5 (24)
      letterSpacing: '-0.01em'
    },
    small: {
      fontWeight: typography.fontWeights.normal,
      fontSize: typography.fontSizes[1],
      lineHeight: typography.lineHeights.short, // 1.4 (19.6)
      letterSpacing: '-0.01em'
    }
  },
  caption: {
    fontSize: typography.fontSizes[0],
    lineHeight: typography.lineHeights.shorter, // 1.333 (16)
    letterSpacing: '0.00em'
  }
}
;(textStyles.body.large as any).medium = {
  ...textStyles.body.large,
  fontWeight: typography.fontWeights.medium
}
;(textStyles.body.small as any).medium = {
  ...textStyles.body.small,
  fontWeight: typography.fontWeights.medium
}
;(textStyles.caption as any).medium = {
  ...textStyles.body.small,
  fontWeight: typography.fontWeights.medium
}

export { textStyles }

export default {
  ...typography,
  textStyles
}
