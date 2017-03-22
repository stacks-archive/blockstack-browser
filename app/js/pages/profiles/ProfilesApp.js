import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { HomeButton, AddressBar } from '../../components/index'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class ProfilesApp extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="app-wrap-profiles">
        <div className="container-fluid site-wrapper">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <div className="home-profiles">
              <HomeButton />
            </div>
            <Link to="/profiles" className="navbar-brand">
              <img src="/images/app-icon-profiles.png" />
            </Link>
            <div className="navbar-collapse" id="navbarSupportedContent">
              <ul className="nav navbar-nav m-b-20">
                <li className="navbar-text">
                  Profiles
                </li>
                <li className="navbar-text navbar-text-secondary">
                  Utility
                </li>
              </ul>
              <AddressBar placeholder="Search for people" />
            </div>
          </nav>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilesApp)