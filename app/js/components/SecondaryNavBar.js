import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

const SecondaryNavLink = props => {
  return (
    <Link 
      to={props.link} 
      className="btn btn-link btn-block">
      {props.title}
    </Link>
  )
}

const SecondaryNavButton = props => {
  return (
    <button
      className="btn btn-link btn-block"
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
  }

  render() {
    return (
      <div className="container">
        <div className="secondary-nav">
          <div className="row">
            <div className="col-xs-4 col-sm-3 col-md-2">
              {this.props.leftButtonTitle !== undefined && (
                this.props.onLeftButtonClick !== undefined ?
                <SecondaryNavButton
                  title={this.props.leftButtonTitle}
                  onClick={this.props.onLeftButtonClick} />
                :
                <SecondaryNavLink 
                  title={this.props.leftButtonTitle} 
                  link={this.props.leftButtonLink} />
                ) }
            </div>
            <div className="col-xs-4 col-sm-6 col-md-8 text-center">
              {this.props.title !== undefined && (
              <h1 className="secondary-nav-title">
                {this.props.title}
              </h1>
              )}
            </div>
            <div className="col-xs-4 col-sm-3 col-md-2">
              {this.props.rightButtonTitle !== undefined && (
                <SecondaryNavLink 
                  title={this.props.rightButtonTitle} 
                  link={this.props.rightButtonLink} />
                )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SecondaryNavBar