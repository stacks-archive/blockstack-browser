import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { PublicKeychain } from 'keychain-manager'

import InputGroup from '../components/InputGroup'
import { KeychainActions } from '../store/keychain'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class WithdrawPage extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <h2>Withdraw</h2>
        <p>Send your funds to another Bitcoin wallet.</p>
        <InputGroup label="Recipient address" placeholder="Recipient address" />
        <div>
          <button className="btn btn-primary">Send</button>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage)
