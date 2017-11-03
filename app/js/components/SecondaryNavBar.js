import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const SecondaryNavLink = props => {
  const alignment = (props.align === 'right') ? 'float-right' : 'float-left'
  const customActiveClass = props.activeClass ? props.activeClass : ''
  const active = props.isActive === true ? `active ${customActiveClass}` : 'default'

  return (
    <Link
      className={`btn btn-outline-dark btn-pill btn-sm ${active}`}
      to={props.link}>
      {props.title}
    </Link>
  )
}

const SecondaryNavButton = props => {
  const alignment = (props.align === "right") ? "float-right" : "float-left"
  const active = props.isActive === true ? "active" : "default"

  return (
    <button
      className={`btn btn-outline-dark btn-pill btn-sm ${active}`}
      title={props.title}
      onClick={props.onClick}>
      {props.title}
    </button>
  )
}

class SecondaryNavBar extends Component {
  static propTypes = {
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
    activeClass: PropTypes.string
  }

  render() {
    const activeClass = this.props.activeClass ? this.props.activeClass : ""
    return (
      <div className="container-xs secondary-nav mx-auto">
        <div className="row">
          <div className="col text-center">
            {this.props.leftButtonTitle !== undefined && (
              this.props.leftIsButton ?
              <SecondaryNavButton
                title={this.props.leftButtonTitle}
                onClick={this.props.onLeftButtonClick}
                align="left"
                isActive={this.props.isLeftActive}
                activeClass={activeClass}
               />
              :
              <SecondaryNavLink
                title={this.props.leftButtonTitle}
                link={this.props.leftButtonLink}
                align="left"
                isActive={this.props.isLeftActive}
                activeClass={activeClass}
               />
              ) }
          </div>
          <div className="col text-center">
          {this.props.centerButtonTitle !== undefined && (
            this.props.centerIsButton ?
              <SecondaryNavLink
                title={this.props.centerButtonTitle}
                onClick={this.props.onCenterButtonClick}
                align="right"
                isActive={this.props.isCenterActive}
                activeClass={activeClass}
              />
            :
              <SecondaryNavLink
                title={this.props.centerButtonTitle}
                link={this.props.centerButtonLink}
                align="right"
                isActive={this.props.isCenterActive}
                activeClass={activeClass}
              />
          )}
          </div>
          <div className="col text-center">
          {this.props.rightButtonTitle !== undefined && (
            this.props.rightIsButton ?
            <SecondaryNavButton
              title={this.props.rightButtonTitle}
              onClick={this.props.onRightButtonClick}
              align="right"
              isActive={this.props.isRightActive}
              activeClass={activeClass}
            />
            :
            <SecondaryNavLink
              title={this.props.rightButtonTitle}
              link={this.props.rightButtonLink}
              align="right"
              isActive={this.props.isRightActive}
              activeClass={activeClass}
            />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default SecondaryNavBar
