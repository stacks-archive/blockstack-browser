/**
 * Blockstack Browser Theme
 * --
 * This file designates the various colors, units and typographic styles for the blockstack browser
 * see https://github.com/jxnblk/styled-system#getting-started
 */

const breakpoints = ['48em', '52em', '64em', '75em']

const palettes = {
  primary: {
    blue: '#2C96FF'
  },
  grey: ['#ffffff', '#F0F0F0', '#fafafa', '#949494', '#68616b', '#18091F', '#080809']
}

export const colors = {
  text: {
    base: palettes.grey[5],
    light: palettes.grey[3]
  },
  blue: palettes.primary.blue,
  grey: palettes.grey
}

const space = [0, 4, 8, 16, 32, 64, 128, 256, 512]

const fontSizes = [12, 14, 16, 20, 24, 32, 48, 64, 96, 128]

const lineHeights = [1, 1.125, 1.25, 1.5]

const fontWeights = {
  normal: 300,
  bold: 700
}

const letterSpacings = {
  normal: 'normal',
  caps: '0.25em'
}

const radii = [0, 2, 4, 8]

const borders = [`1px solid ${colors.grey[2]}`]

const shadows = [`0 1px 2px 0 ${colors.text}`, `0 1px 4px 0 ${colors.text}`]

const theme = {
  breakpoints,
  colors,
  space,
  fontSizes,
  lineHeights,
  fontWeights,
  letterSpacings,
  radii,
  borders,
  shadows
}

export default theme
