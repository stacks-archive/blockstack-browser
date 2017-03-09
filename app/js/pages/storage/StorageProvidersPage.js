import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { PageHeader } from '../../components/index'

import { SettingsActions } from '../../store/settings'

import {
  SELF_HOSTED_S3, BLOCKSTACK_INC, DROPBOX
} from '../../utils/storage/index'
import {
  DROPBOX_APP_ID, getDropboxAccessTokenFromHash
} from '../../utils/storage/dropbox'

var Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    updateApi: PropTypes.func.isRequired,
    resetApi: PropTypes.func.isRequired
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

class StorageProvidersPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      api: this.props.api
    }

    this.onHostedDataValueChange = this.onHostedDataValueChange.bind(this)
    this.connectDropbox = this.connectDropbox.bind(this)
    this.disconnectDropbox = this.disconnectDropbox.bind(this)
    this.updateApi = this.updateApi.bind(this)
  }

  componentWillMount() {

  }

  componentDidMount() {
    let api = this.state.api
    const dropboxAccessToken = getDropboxAccessTokenFromHash(window.location.hash)
    if (dropboxAccessToken != null) {
      api['dropboxAccessToken'] = dropboxAccessToken
      this.setState({ api: api })
      this.props.updateApi(api)
      window.location = "/"
    }
  }


  connectDropbox() {
    var dbx = new Dropbox({ clientId: DROPBOX_APP_ID })
    const port = location.port === '' ? 80 : location.port
    console.log(port)
    window.location = dbx.getAuthenticationUrl(
      `http://localhost:${port}/storage/providers`)
  }

  disconnectDropbox() {
    let api = this.state.api
    var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
    dbx.authTokenRevoke()
    api.dropboxAccessToken = null
    this.setState({ api: api })
    this.props.updateApi(api)
  }

  onHostedDataValueChange(value) {
    let api = this.state.api
    api['hostedDataLocation'] = value
    this.setState({ api: api })
  }

  updateApi() {
    const api = this.state.api
    this.props.updateApi(api)
  }

  render() {
    return (
      <div>
      <h4>Data Hosting Options</h4>

      { this.state.api.hostedDataLocation === DROPBOX ?
        <div>
          <p>
            { this.state.api.dropboxAccessToken == null ?
              <button onClick={this.connectDropbox} className="btn btn-sm btn-outline-primary">
              Connect Dropbox
              </button>
            :
            <button onClick={this.disconnectDropbox} className="btn btn-sm btn-outline-primary">
            Disconnect Dropbox
            </button>
            }
          </p>
          <p>
            <button disabled className="btn btn-sm btn-outline-primary" title="Coming soon!">
            Connect Google Drive
            </button>
          </p>
          <p>
            <button disabled className="btn btn-sm btn-outline-primary" title="Coming soon!">
            Connect Amazon Cloud Drive
            </button>
          </p>
        </div>
      : null }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageProvidersPage)
