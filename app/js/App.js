import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { AccountActions } from './store/account'
import WelcomeModal from './components/WelcomeModal'

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
    this.getCoreAPIPasswordFromURL = this.getCoreAPIPasswordFromURL.bind(this)
  }

  componentWillMount() {
    const coreAPIPassword = this.getCoreAPIPasswordFromURL()
    console.log(coreAPIPassword)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accountCreated: nextProps.encryptedBackupPhrase ? true : false,
      storageConnected: nextProps.dropboxAccessToken ? true : false,
    })
  }

  getCoreAPIPasswordFromURL() {
    const queryDict = queryString.parse(location.search)
    if (queryDict.coreAPIPassword !== null && queryDict.coreAPIPassword !== undefined) {
      return queryDict.coreAPIPassword
    } else {
      return null
    }
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
