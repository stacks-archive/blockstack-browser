import { rgba, lighten } from 'polished'
const colors = {
  blue: Object.assign('#3700FF', {
    very_light: 'hsl(202, 40%, 97%)', // canvas
    light: 'hsl(202, 40%, 96%)', // canvas
    mid: 'hsl(202, 40%, 83%)', // borders / labels on white
    medium: 'hsl(202, 40%, 66%)', // placeholders, helper accents
    neutral: '#403F83', // text
    dark: '#211F6D', // large fills
    darker: '#1A1959', // fills on blue.dark
    accent: '#01FEFE' // cyan / accents / links
  }),
  red: '#F27D66',
  borders: {
    dark: Object.assign('#2F2C88', {
      focus: lighten(0.12, '#403F83')
    }), // borders on dark,
    light: 'hsl(202, 40%, 83%)'
  }
}
// hsl(241, 30%, 55%)
const breakpoints = ['40em', '52em', '64em', '72em', '85em']
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
const transition = [undefined, '0.5s all cubic-bezier(.19,1,.22,1)']
const shadows = {
  button: Object.assign('0px 2px 6px rgba(37, 0, 105, 0.22)', {
    hover: '0px 5px 9px rgba(37,0,105,0.28)',
    active: '0px 2px 2px rgba(37, 0, 105, 0.42)'
  }),
  card: Object.assign('0px 4px 4px rgba(0, 0, 0, 0.05)', {}),
  general: Object.assign('0px 4px 4px rgba(0, 0, 0, 0.05)', {}),
  focused: Object.assign(`${rgba(colors.blue.accent, 0.14)} 0px 0px 0px 4px`, {
    marketing: 'rgba(16, 112, 202, 0.14) 0px 0px 0px 4px',
    light: `hsl(205,30%,95%) 0 0 0 3px`,
    error: `hsla(10,58%,95%, 0.5) 0 0 0 3px`
  })
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
  transition,
  fonts
}
