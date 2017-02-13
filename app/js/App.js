import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { AccountActions } from './store/account'
import { WelcomeModal } from './components/index'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string
  }

  constructor(props) {
    super(props)

    const modalIsOpen = this.props.encryptedBackupPhrase ? false : true

    this.state = {
      modalIsOpen: modalIsOpen,
      password: ''
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <div className="body-main">
        <WelcomeModal
          isOpen={this.state.modalIsOpen}
          closeModal={this.closeModal} />
        {this.props.children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
<section>
  <div className="container-fluid no-padding">
    <div className="app-text-container">
      <button onClick={this.openModal} className="btn btn-primary">
        Open Welcome Modal
      </button>
    </div>
  </div>
</section>

{
  (() => {
    if (process.env.NODE_ENV !== 'production') {
      //const DevTools = require('./components/DevTools')
      //return <DevTools />
    }
  })()
}
*/