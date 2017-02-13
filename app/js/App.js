import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from './store/account'
import { WelcomeModal } from './components/index'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    dropboxAccessToken: state.settings.api.dropboxAccessToken
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    dropboxAccessToken: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      accountCreated: this.props.encryptedBackupPhrase ? true : false,
      storageConnected: this.props.dropboxAccessToken ? true : false,
      password: ''
    }

    this.closeModal = this.closeModal.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.encryptedBackupPhrase ? true : false,
      storageConnected: nextProps.dropboxAccessToken ? true : false,
    })
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <div className="body-main">
        <WelcomeModal
          accountCreated={this.state.accountCreated}
          storageConnected={this.state.storageConnected}
          closeModal={this.closeModal} />
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
{
  (() => {
    if (process.env.NODE_ENV !== 'production') {
      //const DevTools = require('./components/DevTools')
      //return <DevTools />
    }
  })()
}
*/