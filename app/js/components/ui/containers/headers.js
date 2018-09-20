import React from 'react'
import { Bug as StyledBug } from '@ui/components/bugs'
import { StyledHeader } from '@ui/components/header'
import { BlockstackBug } from '@ui/components/logos'
import { isArray } from '@common'
import ArrowLeftIcon from 'mdi-react/ArrowLeftIcon'
import ChevronDoubleRightIcon from 'mdi-react/ChevronDoubleRightIcon'
import PropTypes from 'prop-types'

const Bug = ({ children, size = 48, ...rest }) => (
  <StyledBug {...rest} size={size}>
    {children}
  </StyledBug>
)

Bug.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.number
}

const Bugs = StyledBug.Container

const HeaderLink = ({
  action,
  label = 'Back',
  icon: Icon = ArrowLeftIcon,
  ...rest
}) => {
  const props = action
    ? {
        onClick: () => action(),
        ...rest
      }
    : { ...rest }
  return (
    <StyledHeader.Link {...props}>
      {Icon && label.includes('Back') && !label.includes(' ') ? (
        <StyledHeader.Link.Icon>
          <Icon size={14} />
        </StyledHeader.Link.Icon>
      ) : null}
      <StyledHeader.Link.Label>{label}</StyledHeader.Link.Label>
    </StyledHeader.Link>
  )
}

HeaderLink.propTypes = {
  action: PropTypes.func,
  label: PropTypes.string,
  icon: PropTypes.node
}
const Header = ({
  app,
  action,
  invert,
  label,
  icon,
  disableBackOnView,
  disable,
  view,
  ...rest
}) => {
  const renderBugs = () => {
    if (app) {
      return (
        <Bugs>
          <BlockstackBug invert={invert} size={28} />
          <StyledBug.Arrows>
            <ChevronDoubleRightIcon color={'rgba(39, 16, 51, 0.2)'} size={18} />
          </StyledBug.Arrows>
          <Bug size={28} title={app.name}>
            <img src={app.icon} alt={app.name} />
          </Bug>
        </Bugs>
      )
    } else {
      return (
        <Bugs>
          <BlockstackBug invert={invert} size={28} />
        </Bugs>
      )
    }
  }

  const linkProps = {
    action,
    label,
    icon,
    disableBackOnView,
    disable
  }

  const disableBack = isArray(disableBackOnView)
    ? !!disableBackOnView.find(index => index === view)
    : disableBackOnView === view
  return (
    <StyledHeader invert={invert} {...rest}>
      <StyledHeader.Section>
        {disableBack ? null : <HeaderLink {...linkProps} />}
      </StyledHeader.Section>
      <StyledHeader.Section>{renderBugs()}</StyledHeader.Section>
    </StyledHeader>
  )
}

Header.propTypes = {
  app: PropTypes.object,
  action: PropTypes.func,
  label: PropTypes.string,
  icon: PropTypes.node,
  disableBackOnView: PropTypes.bool,
  view: PropTypes.number,
  disable: PropTypes.bool,
  invert: PropTypes.bool
}

export { Header }
