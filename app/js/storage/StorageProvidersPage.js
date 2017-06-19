import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { SettingsActions } from '../account/store/settings'

import { DROPBOX } from './utils/index'
import { DROPBOX_APP_ID, getDropboxAccessTokenFromHash } from './utils/dropbox'

import { setCoreStorageConfig } from '../utils/api-utils'

const Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    updateApi: PropTypes.func.isRequired,
    resetApi: PropTypes.func.isRequired,
    localIdentities: state.profiles.identity.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

class StorageProvidersPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    localIdentities: PropTypes.object.isRequired,
    identityKeypairs: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.connectDropbox = this.connectDropbox.bind(this)
    this.disconnectDropbox = this.disconnectDropbox.bind(this)
    this.updateApi = this.updateApi.bind(this)
  }

  componentDidMount() {
    const api = this.props.api
    const dropboxAccessToken = getDropboxAccessTokenFromHash(window.location.hash)
    if (dropboxAccessToken != null) {
      this.props.updateApi(Object.assign({}, api, { dropboxAccessToken }))
      setCoreStorageConfig({ dropbox: { token: dropboxAccessToken } }, api.coreAPIPassword )
      .then(() => {
        console.log(privateKey)
        window.location = '/'
      })
    }
  }

  connectDropbox() {
    const dbx = new Dropbox({ clientId: DROPBOX_APP_ID })
    const port = location.port === '' ? 80 : location.port
    console.log(port)
    window.location = dbx.getAuthenticationUrl(
      `http://localhost:${port}/storage/providers`)
  }

  disconnectDropbox() {
    const api = this.props.api
    const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
    dbx.authTokenRevoke()
    this.props.updateApi(Object.assign({}, api, { dropboxAccessToken: null }))
  }

  updateApi() {
    const api = this.props.api
    this.props.updateApi(api)
  }

  render() {
    const api = this.props.api
    return (
      <div>
        <h1 className="h1-modern" style={{ marginTop: '35px' }}>
          Providers
        </h1>
        <p>
          Your profile and app data will be securely stored in the storage providers you connect.
        </p>
        {api.hostedDataLocation === DROPBOX ?
          <div>
            <p>
              {api.dropboxAccessToken == null ?
                <button onClick={this.connectDropbox} className="btn btn-storage-primary">
                Connect Dropbox
                </button>
              :
                <button
                  onClick={this.disconnectDropbox}
                  className="btn btn-storage-primary"
                >
                Disconnect Dropbox
                </button>
              }
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
                Connect IPFS
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
                Connect Sia
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
                Connect Storj
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
                Connect Google Drive
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
                Connect Amazon Cloud Drive
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
              Connect Microsoft OneDrive
              </button>
            </p>
            <p>
              <button disabled className="btn btn-storage-primary" title="Coming soon!">
              Connect Self-hosted Drive
              </button>
            </p>
          </div>
        : null}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StorageProvidersPage)
