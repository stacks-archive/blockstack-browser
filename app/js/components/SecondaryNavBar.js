import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router'

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
  isActive: PropTypes.boolean,
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
  isActive: PropTypes.boolean,
  customButtonClass: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func
}

const SecondaryNavBar = props => {
  const activeClass = props.activeClass ? props.activeClass : ''
  return (
    <div className="container-fluid secondary-nav mx-auto">
      <div className="row">
        <div className="col text-left">
          {props.leftButtonTitle !== undefined && (
            props.leftIsButton ?
              <SecondaryNavButton
                title={props.leftButtonTitle}
                onClick={props.onLeftButtonClick}
                align="left"
                isActive={props.isLeftActive}
                activeClass={activeClass}
                customButtonClass={props.customButtonClass}
              />
            :
              <SecondaryNavLink
                title={props.leftButtonTitle}
                link={props.leftButtonLink}
                align="left"
                isActive={props.isLeftActive}
                activeClass={activeClass}
                customButtonClass={props.customButtonClass}
              />
            )}
        </div>
        <div className="col text-center">
        {props.centerButtonTitle !== undefined && (
          props.centerIsButton ?
            <SecondaryNavLink
              title={props.centerButtonTitle}
              onClick={props.onCenterButtonClick}
              align="right"
              isActive={props.isCenterActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
          :
            <SecondaryNavLink
              title={props.centerButtonTitle}
              link={props.centerButtonLink}
              align="right"
              isActive={props.isCenterActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
        )}
        </div>
        <div className="col text-right">
        {props.rightButtonTitle !== undefined && (
          props.rightIsButton ?
            <SecondaryNavButton
              title={props.rightButtonTitle}
              onClick={props.onRightButtonClick}
              align="right"
              isActive={props.isRightActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
          :
            <SecondaryNavLink
              title={props.rightButtonTitle}
              link={props.rightButtonLink}
              align="right"
              isActive={props.isRightActive}
              activeClass={activeClass}
              customButtonClass={props.customButtonClass}
            />
          )}
        </div>
      </div>
    </div>
  )
}

SecondaryNavBar.propTypes = {
  title: PropTypes.string,
  leftButtonTitle: PropTypes.string,
  centerButtonTitle: PropTypes.string,
  rightButtonTitle: PropTypes.string,
  leftButtonLink: PropTypes.string,
  centerButtonLink: PropTypes.string,
  rightButtonLink: PropTypes.string,
  leftIsButton: PropTypes.bool,
  centerIsButton: PropTypes.bool,
  rightIsButton: PropTypes.bool,
  onLeftButtonClick: PropTypes.func,
  onCenterButtonClick: PropTypes.func,
  onRightButtonClick: PropTypes.func,
  isLeftActive: PropTypes.bool,
  isCenterActive: PropTypes.bool,
  isRightActive: PropTypes.bool,
  activeClass: PropTypes.string,
  customButtonClass: PropTypes.string
}

export default SecondaryNavBar
