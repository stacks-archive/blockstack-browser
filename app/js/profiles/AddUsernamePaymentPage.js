import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../account/store/account'
import { AvailabilityActions } from './store/availability'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/AddUsernameSearchPage.js')

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class AddUsernamePaymentPage extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    return (
      <div>
      AddUsernamePaymentPage
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsernamePaymentPage)
