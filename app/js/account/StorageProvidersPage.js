import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../account/store/account'
import { SettingsActions } from '../account/store/settings'

import { DROPBOX, BLOCKSTACK_INC } from './utils/index'
import { getDropboxAccessTokenFromHash,
  redirectToConnectToDropbox } from './utils/dropbox'

import { connectToBlockstackService } from './utils/blockstack-inc'

import { setCoreStorageConfig } from '../utils/api-utils'
import log4js from 'log4js'

import bitcoin from 'bitcoinjs-lib'

const logger = log4js.getLogger('storage/StorageProvidersPage.js')

const Dropbox = require('dropbox')

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    updateApi: PropTypes.func.isRequired,
    resetApi: PropTypes.func.isRequired,
    localIdentities: state.profiles.identity.localIdentities,
    identityKeypairs: state.account.identityAccount.keypairs,
    connectedStorageAtLeastOnce: state.account.connectedStorageAtLeastOnce
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, SettingsActions, AccountActions)
  return bindActionCreators(actions, dispatch)
}

class StorageProvidersPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    localIdentities: PropTypes.object.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    storageIsConnected: PropTypes.func.isRequired,
    connectedStorageAtLeastOnce: PropTypes.bool.isRequired
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
      this.props.storageIsConnected()
      const newApi = Object.assign({}, api, { dropboxAccessToken, storageConnected : true })
      this.props.updateApi(newApi)
      setCoreStorageConfig(newApi)
      .then((indexUrl) => {
        logger.debug(`componentDidMount: indexUrl: ${indexUrl}`)
        // TODO add index URL to token file
        logger.debug('componentDidMount: storage initialized')
      })
    }
    if (window.location.hash === "#blockstack") {
      this.connectSharedService()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.api.dropboxAccessToken) {
      if (!this.props.connectedStorageAtLeastOnce &&
        nextProps.connectedStorageAtLeastOnce) {
        window.location = '/'
      }
    }
  }

  connectDropbox() {
    redirectToConnectToDropbox()
  }

  disconnectDropbox() {
    const api = this.props.api
    const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
    dbx.authTokenRevoke()
    this.props.updateApi(Object.assign({}, api, { dropboxAccessToken: null }))
  }

  connectSharedService() {
    const storageProvider = "http://localhost:5000"
    const signer = this.props.identityKeypairs[0].key
    connectToBlockstackService(storageProvider, signer)
      .then( (gaiaHubConfig) => {
        this.props.storageIsConnected()
        const newApi = Object.assign({}, this.props.api,
                                     { gaiaHubConfig,
                                       storageConnected : true,
                                       hostedDataLocation : BLOCKSTACK_INC })
        this.props.updateApi(newApi)
        setCoreStorageConfig(newApi)
        logger.debug('storage configured')
      })
  }

  disconnectSharedService() {
    // noop
  }

  updateApi() {
    const api = this.props.api
    this.props.updateApi(api)
  }

  render() {
    const api = this.props.api
    return (
      <div className="m-b-100" style={{ paddingLeft: '15px' }}>
        <h1 className="h1-modern m-t-10">
          Storage Providers
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
