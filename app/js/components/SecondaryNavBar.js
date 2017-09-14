import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const SecondaryNavLink = props => {
  const alignment = (props.align === "right") ? "float-right" : "float-left"
  const active = props.isActive === true ? "active" : "default"

  return (
    <Link 
      className={`btn btn-link btn-block ${alignment} ${active}`}
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
      className={`btn btn-link btn-block ${alignment} ${active}`}
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
    rightButtonTitle: PropTypes.string,
    leftButtonLink: PropTypes.string,
    rightButtonLink: PropTypes.string,
    onLeftButtonClick: PropTypes.func,
    onRightButtonClick: PropTypes.func,
    isLeftActive: PropTypes.bool,
    isRightActive: PropTypes.bool
  }

  render() {
    return (
      <div className="container-fluid secondary-nav">
        <div className="row">
          <div className="col">
            {this.props.leftButtonTitle !== undefined && (
              this.props.onLeftButtonClick !== undefined ?
              <SecondaryNavButton
                title={this.props.leftButtonTitle}
                onClick={this.props.onLeftButtonClick}
                align="left" 
                isActive={this.props.isLeftActive} />
              :
              <SecondaryNavLink 
                title={this.props.leftButtonTitle} 
                link={this.props.leftButtonLink}
                align="left"
                isActive={this.props.isLeftActive} />
              ) }
          </div>
          <div className="col">
          {this.props.rightButtonTitle !== undefined && (
            this.props.onRightButtonClick !== undefined ?
            <SecondaryNavButton
              title={this.props.rightButtonTitle}
              onClick={this.props.onRightButtonClick}
              align="right"
              isActive={this.props.isRightActive} />
            :
            <SecondaryNavLink 
              title={this.props.rightButtonTitle} 
              link={this.props.rightButtonLink}
              align="right"
              isActive={this.props.isRightActive} />
            ) }
          </div>
        </div>
      </div>
    )
  }
}

export default SecondaryNavBar