import React from 'react'
import HomeIcon from 'mdi-react/AppsIcon'
import IDsIcon from 'mdi-react/AccountCircleIcon'
import WalletIcon from 'mdi-react/WalletIcon'
import SettingsIcon from 'mdi-react/SettingsIcon'
import { Hover, Focus } from 'react-powerplug'
import { Box, Flex, Type } from 'blockstack-ui'
import { Link, withRouter } from 'react-router'
import PropTypes from 'prop-types'

const sections = [
  [
    {
      label: 'Home',
      icon: HomeIcon,
      path: '/',
      active: '/'
    }
  ],
  [
    {
      label: 'Identity',
      icon: IDsIcon,
      path: '/profiles',
      active: 'profiles'
    },
    {
      label: 'Wallet',
      icon: WalletIcon,
      path: '/wallet/receive',
      active: 'wallet'
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      path: '/account',
      active: 'account'
    }
  ]
]

const Wrapper = ({ ...rest }) => (
  <Flex
    maxWidth={700}
    mx="auto"
    justifyContent="space-between"
    width={1}
    {...rest}
  />
)

const Icon = ({ component: Component, ...rest }) => (
  <Box {...rest}>
    <Component />
  </Box>
)

const Label = ({ children, ...rest }) => (
  <Box {...rest}>
    <Type fontWeight={600}>{children}</Type>
  </Box>
)

const NavItem = ({ label, icon, path, active, ...rest }) => (
  <React.Fragment {...rest}>
    <Focus>
      {({ focused, bind: focusBind }) => (
        <Hover>
          {({ hovered, bind }) => (
            <Flex
              color={
                active || focused || hovered
                  ? '#2c96ff !important'
                  : '#949494 !important'
              }
              alignItems="center"
              flexDirection="column"
              size="84px"
              p={3}
              cursor={hovered ? 'pointer' : 'unset'}
              style={{ userSelect: 'none' }}
              is={Link}
              to={path}
              {...bind}
              {...focusBind}
            >
              <Icon component={icon} />
              <Label>{label}</Label>
            </Flex>
          )}
        </Hover>
      )}
    </Focus>
  </React.Fragment>
)

const Navbar = withRouter(({ location }) => (
  <Box
    borderBottom="1px solid #f0f0f0"
    bg="white"
    position="fixed"
    top={0}
    width={1}
    zIndex={999}
  >
    <Wrapper>
      {sections.map((section, i) => (
        <Flex key={i}>
          {section.map(({ label, icon, path, active }) => (
            <NavItem
              key={path}
              label={label}
              icon={icon}
              path={path}
              active={
                (location.pathname === '/' && active === '/') ||
                (location.pathname &&
                  location.pathname.split('/')[1].includes(active))
              }
            />
          ))}
        </Flex>
      ))}
    </Wrapper>
  </Box>
))

Icon.propTypes = {
  component: PropTypes.node
}
Label.propTypes = {
  children: PropTypes.node
}
NavItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  path: PropTypes.string,
  active: PropTypes.bool
}

Navbar.propTypes = {
  location: PropTypes.object.isRequired
}

export default Navbar
