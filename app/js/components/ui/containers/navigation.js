import React from 'react'
import PropTypes from 'prop-types'
import { StyledNavigation } from '@components/ui/components/navigation'
import { AppsIcon, AccountIcon, WalletIcon, SettingsIcon } from 'mdi-react'
import { withRouter } from 'react-router'

const NAV_ITEMS = {
  left: [
    {
      label: 'dApps',
      Icon: AppsIcon,
      to: '/'
    }
  ],
  right: [
    {
      label: 'IDs',
      Icon: AccountIcon,
      to: '/profiles'
    },
    {
      label: 'Wallet',
      Icon: WalletIcon,
      to: '/wallet/receive'
    },
    {
      label: 'Settings',
      Icon: SettingsIcon,
      to: '/account'
    }
  ]
}

const active = (to, pathname) => {
  if (to === '/') {
    return pathname === to
  }
  return pathname.includes(to)
}

const NavigationItem = ({ label, to, Icon, key, pathname, ...rest }) => (
  <StyledNavigation.Item
    to={to}
    key={key}
    active={active(to, pathname)}
    {...rest}
  >
    <StyledNavigation.Item.Icon>
      <Icon />
    </StyledNavigation.Item.Icon>
    <StyledNavigation.Item.Label>{label}</StyledNavigation.Item.Label>
  </StyledNavigation.Item>
)
const NavItems = ({ items, pathname }) => {
  if (!items || !items.length) {
    return null
  }
  return items.map((item, i) => (
    <NavigationItem {...item} key={i} pathname={pathname} />
  ))
}

class NavigationContainer extends React.PureComponent {
  render() {
    const { location: { pathname } } = this.props
    return (
      <StyledNavigation>
        <StyledNavigation.Wrapper>
          <StyledNavigation.Section>
            <NavItems items={NAV_ITEMS.left} pathname={pathname} />
          </StyledNavigation.Section>
          <StyledNavigation.Section>
            <NavItems items={NAV_ITEMS.right} pathname={pathname} />
          </StyledNavigation.Section>
        </StyledNavigation.Wrapper>
      </StyledNavigation>
    )
  }
}

const Navigation = withRouter(NavigationContainer)

NavigationItem.propTypes = {
  label: PropTypes.node,
  to: PropTypes.string,
  Icon: PropTypes.node,
  key: PropTypes.string,
  pathname: PropTypes.string
}

NavItems.propTypes = {
  items: PropTypes.array.isRequired,
  pathname: PropTypes.string.isRequired
}

NavigationContainer.propTypes = {
  location: PropTypes.object.isRequired
}

export { Navigation }
