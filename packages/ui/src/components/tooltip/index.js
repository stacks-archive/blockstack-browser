import sys from 'system-components'
import { themeGet } from 'styled-system'
import { Box, blacklist } from '../primitives'

const Tooltip = sys(
  {
    is: Box,
    color: 'white',
    bg: 'black',
    blacklist
  },
  (props) => ({
    display: 'inline-block',
    position: 'relative',
    color: 'inherit',
    backgroundColor: 'transparent',
    zIndex: 99999,
    '&::before': {
      display: 'none',
      fontFamily: themeGet(`fonts.default`)(props),
      content: `"${props.text}"`,
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, -4px)',
      whiteSpace: 'nowrap',
      fontSize: '12px',
      paddingTop: '4px',
      paddingBottom: '4px',
      paddingLeft: '8px',
      zIndex: 99999,
      paddingRight: '8px',
      color: themeGet(`colors.${props.color}`)(props),
      backgroundColor: themeGet(`colors.${props.bg}`)(props),
      borderRadius: `${themeGet('radii.1')(props)}px`
    },
    '&::after': {
      display: 'none',
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%, 8px)',
      content: '" "',
      zIndex: 99999,
      fontFamily: 'default',
      borderWidth: '6px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderTopColor: themeGet(`colors.${props.bg}`)(props)
    },
    '&:hover': {
      '&::before, &::after': {
        display: 'block'
      }
    }
  }),
  'space',
  'color'
)

Tooltip.displayName = 'Tooltip'

Tooltip.defaultProps = {
  bg: 'blue.dark',
  color: 'blue.light',
  zIndex: 999
}
export { Tooltip }
