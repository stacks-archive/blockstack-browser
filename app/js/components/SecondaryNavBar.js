import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const SecondaryNavLink = props => {

  const btnClasses = "btn btn-link"
  const classes = (props.align === "right") ? `${btnClasses} float-right` : `${btnClasses} float-left`

  return (
    <Link to={props.link} className={classes}>
      {props.title}
    </Link>
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
  }

  render() {
    return (
      <div className="container">
        <div className="secondary-nav">
          <div className="row">
            <div className="col-xs-4">
              {this.props.leftButtonTitle !== undefined && (
                <SecondaryNavLink 
                  title={this.props.leftButtonTitle} 
                  link={this.props.leftButtonLink} 
                  align="left" />
                ) }
            </div>
            <div className="col-xs-4 text-center">
              {this.props.title !== undefined && (
              <h1 className="secondary-nav-title">
                {this.props.title}
              </h1>
              )}
            </div>
            <div className="col-xs-4">
              {this.props.rightButtonTitle !== undefined && (
                <SecondaryNavLink 
                  title={this.props.rightButtonTitle} 
                  link={this.props.rightButtonLink} 
                  align="right" />
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SecondaryNavBar