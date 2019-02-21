# Logos

These components are the logos for our various projects.

## Example

```jsx
import { Box, BlockstackLogo } from 'blockstack-ui'

const Component = (props) => (
  <Box>
    <BlockstackLogo />
  </Box>
)
```

### Props

These logos take the following props:

```jsx
propTypes = {
  width: PropTypes.oneOf([PropTypes.number, PropTypes.string, PropTypes.array]),
  typeSize: PropTypes.number,
  invert: PropTypes.bool,
  color: PropTypes.string
}
```

### Getting a specific type size

The type size at their initial scale are all 16px. You can pass a `typeSize` that will render the component at the provided type size, for example:

```jsx
<AppMiningLogo typeSize={32} /> // will render the logo at the scale needed for the font to be at 32px
```

NB: If you pass a `width` prop, it will overwrite any `typeSize` passed.


### Inverting

You can pass the `invert` prop to render the version to be displayed on a darker background.
