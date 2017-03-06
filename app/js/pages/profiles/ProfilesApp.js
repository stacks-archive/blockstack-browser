import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddressBar          from '../../components/AddressBar'

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

    this.state = {
    }
  }

  render() {
    return (
      <div className="app-wrap-profiles">
        <div className="container-fluid site-wrapper">
          <nav className="navbar navbar-toggleable-md navbar-light">
            <a className="navbar-brand" href="/">
              <div className="btn-home-profiles">
                ‹ Home
              </div>
            </a>
            <a className="navbar-brand" href="/profiles">
              <img src="/images/app-icon-profiles.png" />
            </a>
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