import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../account/store/account'
import { AvailabilityActions } from './store/availability'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/AddUsernameSelectPage.js')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability,
    walletBalance: state.account.coreWallet.balance
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class AddUsernameSelectPage extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props)
    const ownerAddress = this.props.routeParams.index
    const name = this.props.routeParams.name

    this.state = {
      ownerAddress,
      name
    }
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    this.props.refreshCoreWalletBalance(this.props.api.addressBalanceUrl,
      this.props.api.coreAPIPassword)
  }

  render() {
    const name = this.props.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    const isSubdomain = name.split('.').length === 3
    let enoughMoney = false
    const price = nameAvailabilityObject.price
    const walletBalance = this.props.walletBalance

    if (isSubdomain || (walletBalance > price)) {
      enoughMoney = true
    }

    return (
      <div>
      AddUsernameSelectPage: {this.state.name}
      {enoughMoney ?
        <div>confirm</div>
        :
        <div>deposit {price}</div>
      }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsernameSelectPage)
