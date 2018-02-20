import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SecondaryNavBar from '../components/SecondaryNavBar'
import Navbar from '../components/Navbar'


function mapStateToProps() {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class WalletApp extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const childPath = this.props.children.props.route.path
    const activeTabUrl = `/wallet/${childPath}`

    return (
      <div>
        <Navbar activeTab="wallet" />
        <SecondaryNavBar
          leftButtonTitle="Receive"
          leftButtonLink="/wallet/receive"
          isLeftActive={(activeTabUrl === '/wallet/receive')}
          rightButtonTitle="Send"
          rightButtonLink="/wallet/send"
          isRightActive={(activeTabUrl === '/wallet/send')}
          activeClass="active-wallet"
          customButtonClass="btn-wallet"
        />
        <div className="container-fluid col-centered form-container-secondary">
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletApp)
