import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SecondaryNavBar from '../components/SecondaryNavBar'
import PageHeader from '../components/PageHeader'
import Navbar from '../components/Navbar'

import log4js from 'log4js'

const logger = log4js.getLogger('account/StorageProvidersPage.js')

function mapStateToProps(state) {
  return {
    storageConnected: state.settings.api.storageConnected
  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AccountApp extends Component {
  static propTypes = {
    children: PropTypes.object,
    storageConnected: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { }
  }

  render() {
    return (
      <div className="body-inner bkg-light">
        <Navbar activeTab="settings"/>
        {this.props.location.pathname === '/account' || !this.props.storageConnected ?
        null
        :
        <SecondaryNavBar leftButtonTitle="Back" leftButtonLink="/account" />
        }

        <div className="container-fluid vertical-split-content">
          <div className="row">
            <div className="w-100">
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountApp)
