import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from '../store/account'

function mapStateToProps(state) {
  return {
    addresses: state.account.bitcoinAccount.addresses,
    balances: state.account.bitcoinAccount.balances
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class Balance extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    balances: PropTypes.object.isRequired,
    refreshBalances: PropTypes.func.isRequired
  }

  constructor() {
    super()
  }

  componentDidMount() {
    this.props.refreshBalances(this.props.addresses)
  }

  render() {
    return (
      <div className="balance">
      <label>Balance:</label>&nbsp;{this.props.balances.total}&nbsp;<label>btc</label>
      </div>
    )
  }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Balance)
