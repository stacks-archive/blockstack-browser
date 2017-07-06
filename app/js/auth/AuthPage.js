import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AuthModal from './components/AuthModal'
import HomeScreenPage from '../HomeScreenPage'

function mapStateToProps(state) {
  return {
    addresses: state.account.identityAccount.addresses,
    publicKeychain: state.account.identityAccount.publicKeychain
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class AuthPage extends Component {
  static propTypes = {
    addresses: PropTypes.array.isRequired,
    publicKeychain: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <HomeScreenPage />
        <AuthModal
          addresses={this.props.addresses}
          publicKeychain={this.props.publicKeychain} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthPage)