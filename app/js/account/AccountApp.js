import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SecondaryNavBar from '../components/SecondaryNavBar'
import PageHeader from '../components/PageHeader'
import StatusBar from '../components/StatusBar'

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AccountApp extends Component {
  static propTypes = {
    children: PropTypes.object
  }

  constructor(props) {
    super(props)

    this.state = { }
  }

  render() {
    return (
      <div className="body-inner bkg-light">
        <StatusBar />
        { this.props.location.pathname !== '/account' && (
        <SecondaryNavBar leftButtonTitle="Back" leftButtonLink="/account" />
        )}

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

export default connect(null, mapDispatchToProps)(AccountApp)
