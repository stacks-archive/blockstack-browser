import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import queryString from 'query-string'
import { AccountActions } from './store/account'
import { SettingsActions } from './store/settings'
import WelcomeModal from './components/WelcomeModal'
import qsm from 'qsm'

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    dropboxAccessToken: state.settings.api.dropboxAccessToken,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, SettingsActions), dispatch)
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedBackupPhrase: PropTypes.string,
    dropboxAccessToken: PropTypes.string,
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired
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
    if (coreAPIPassword != null) {
      let api = this.props.api
      api = Object.assign({}, api, { coreAPIPassword })
      this.props.updateApi(api)
      const newLocation = qsm.remove(location.href, 'coreAPIPassword')
      window.location = newLocation
    }
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
