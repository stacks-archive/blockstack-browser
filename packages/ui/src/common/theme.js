const colors = {
  blue: Object.assign('#3700FF', {
    light: '#F1F6F9', // canvas
    mid: '#C4D8E5', // borders / labels on white
    neutral: '#403F83', // text
    dark: '#211F6D', // large fills
    accent: '#01FEFE' // cyan / accents / links
  }),
  borders: {
    dark: '#2F2C88', // borders on dark,
    light: '#C4D8E5'
  }
}
const breakpoints = ['40em', '52em', '64em']
const fontSizes = [12, 14, 16, 20, 24, 28, 32, 36, 48, 64, 96, 128]
const space = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96]
const lineHeights = [1, 1.125, 1.25, 1.5, 1.75]
const fontWeights = {
  light: 300,
  normal: 400,
  semibold: 600,
  bold: 700
}
const fonts = {
  brand: `'IBM Plex Mono', 'Fira Mono', monospace`,
  default: `-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif`
}
const radii = [0, 2, 4, 8]
const borders = [0, '1px solid', '2px solid']

const shadows = {
  button: Object.assign('0px 2px 6px rgba(37, 0, 105, 0.22)', {
    hover: '0px 5px 9px rgba(37,0,105,0.28)',
    active: '0px 2px 2px rgba(37, 0, 105, 0.42)'
  }),
  card: Object.assign('0px 4px 4px rgba(0, 0, 0, 0.05)', {}),
  general: Object.assign('0px 4px 4px rgba(0, 0, 0, 0.05)', {})
}

export const theme = {
  breakpoints,
  colors,
  space,
  fontSizes,
  lineHeights,
  fontWeights,
  radii,
  borders,
  shadows,
  fonts
}
