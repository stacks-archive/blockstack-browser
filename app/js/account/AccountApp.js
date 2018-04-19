import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SecondaryNavBar from '../components/SecondaryNavBar'
import Navbar from '../components/Navbar'

function mapStateToProps(state) {
  return {
    storageConnected: state.settings.api.storageConnected
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export class AccountApp extends Component {
  static propTypes = {
    children: PropTypes.object,
    storageConnected: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <Navbar activeTab="settings" />
        {this.props.location.pathname === '/account' || !this.props.storageConnected ? null : (
          <SecondaryNavBar leftButtonTitle="Back" leftButtonLink="/account" />
        )}

        <div className="container-fluid vertical-split-content">
          <div className="row">
            <div className="w-100">{this.props.children}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountApp)
