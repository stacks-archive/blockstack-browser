import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'
import * as Styled from './styled/SecondaryNavBar'

const SecondaryNavLink = props => {
  const customActiveClass = props.activeClass ? props.activeClass : ''
  const active = props.isActive === true ? `active ${customActiveClass}` : 'default'

  return (
    <Link
      className={`btn btn-outline-dark btn-pill btn-sm ${active} ${props.customButtonClass}`}
      to={props.link}
    >
      {props.title}
    </Link>
  )
}

SecondaryNavLink.propTypes = {
  activeClass: PropTypes.string,
  isActive: PropTypes.bool,
  customButtonClass: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string
}

const SecondaryNavButton = props => {
  const active = props.isActive === true ? 'active' : 'default'

  return (
    <button
      className={`btn btn-outline-dark btn-pill btn-sm ${active} ${props.customButtonClass}`}
      title={props.title}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  )
}

SecondaryNavButton.propTypes = {
  activeClass: PropTypes.string,
  isActive: PropTypes.bool,
  customButtonClass: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func
}

const SecondaryNavBar = props => {
  const activeClass = props.activeClass ? props.activeClass : ''
  return (
    <Styled.Container className="container-fluid secondary-nav mx-auto">
      <Styled.Column>
        {props.leftButtonTitle !== undefined && (
          props.leftIsButton ?
            <SecondaryNavButton
              title={props.leftButtonTitle}
              onClick={props.onLeftButtonClick}
              isActive={props.isLeftActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
          :
            <SecondaryNavLink
              title={props.leftButtonTitle}
              link={props.leftButtonLink}
              isActive={props.isLeftActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
          )}
      </Styled.Column>
      <Styled.Column>
      {props.rightButtonTitle !== undefined && (
        props.rightIsButton ?
          <SecondaryNavButton
            title={props.rightButtonTitle}
            onClick={props.onRightButtonClick}
            isActive={props.isRightActive}
            activeClass={activeClass}
            customButtonClass={props.customButtonClass}
          />
        :
          <SecondaryNavLink
            title={props.rightButtonTitle}
            link={props.rightButtonLink}
            isActive={props.isRightActive}
            activeClass={activeClass}
            customButtonClass={props.customButtonClass}
          />
        )}
      </Styled.Column>
    </Styled.Container>
  )
}

SecondaryNavBar.propTypes = {
  title: PropTypes.string,
  leftButtonTitle: PropTypes.string,
  rightButtonTitle: PropTypes.string,
  leftButtonLink: PropTypes.string,
  rightButtonLink: PropTypes.string,
  leftIsButton: PropTypes.bool,
  rightIsButton: PropTypes.bool,
  onLeftButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
  isLeftActive: PropTypes.bool,
  isRightActive: PropTypes.bool,
  activeClass: PropTypes.string,
  customButtonClass: PropTypes.string
}

export default SecondaryNavBar
