import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PublicKeychain } from 'keychain-manager'

import { InputGroup, AccountSidebar } from '../../components/index'
import { KeychainActions } from '../../store/keychain'

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
      <div className="body-inner body-inner-white">
        <div className="page-header-wrap">
          <div className="container-fluid page-header p-r-5">
            <div className="pull-left m-t-1">
              <span className="m-l-2">
                <img src="images/ch-bw-rgb-rev.svg" alt="Chord logo" width="60px" />
              </span>
            </div>
            <h1 className="type-inverse text-lowercase m-t-11">Withdraw</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <AccountSidebar />
            </div>
            <div className="col-md-9">
              <p>Send your funds to another Bitcoin wallet.</p>
              <InputGroup label="Recipient address" placeholder="Recipient address" />
              <div>
                <button className="btn btn-primary">Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawPage)
