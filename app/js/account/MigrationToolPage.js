import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import log4js from 'log4js'

import { AccountActions } from './store/account'

import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'

import {
  decrypt,
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode,
  deriveIdentityKeyPair } from '../utils'

const logger = log4js.getLogger('account/MigrationToolPage.js')

const KEYCHAIN_VERSIONS = ['current', 'v0.9']

const tableStyle = {
  width: '100%'
}

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, AccountActions)
  return bindActionCreators(actions, dispatch)
}

class MigrationToolPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired,
    displayedRecoveryCode: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      decryptedBackupPhrase: null,
      backupPhrase: null,
      password: '',
      alerts: [],
      number: 10,
      results: {}
    }

    this.onChange = this.onChange.bind(this)
    this.decryptBackupPhrase = this.decryptBackupPhrase.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.search = this.search.bind(this)
    this.getKeyPair = this.getKeyPair.bind(this)
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  updateAlert(alertStatus, alertMessage) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase(event) {
    logger.trace('decryptBackupPhrase')
    event.preventDefault()
    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    logger.debug('Trying to decrypt backup phrase...')
    decrypt(dataBuffer, password)
    .then((plaintextBuffer) => {
      logger.debug('Using current identity key phrase')
      this.updateAlert('success', 'Backup phrase decrypted')
      this.props.displayedRecoveryCode()
      this.setState({
        backupPhrase: plaintextBuffer.toString(),
        password: ''
      })
    }, () => {
      logger.error('Invalid password')
      this.updateAlert('danger', 'Invalid password')
    })
  }

  search(event) {
    logger.trace('search')
    event.preventDefault()
    const backupPhrase = this.state.backupPhrase
    if (!(backupPhrase && bip39.validateMnemonic(backupPhrase))) {
      this.updateAlert('danger', 'Invalid identity key: phrase is not a valid bip39 mnemonic')
      return
    }
    const seed = bip39.mnemonicToSeed(backupPhrase)
    const masterKeychain = HDNode.fromSeedBuffer(seed)
    const results = {}

    KEYCHAIN_VERSIONS.forEach((version) => {
      const thisVersionResults = []
      for (let addressIndex = 0; addressIndex < this.state.number; addressIndex++) {
        const keyPair = this.getKeyPair(masterKeychain, addressIndex, version)
        thisVersionResults.push(keyPair)
      }
      results[version] = thisVersionResults
    })
    this.setState({
      results
    })
  }

  getKeyPair(masterKeychain, addressIndex, version = 'current') {
    switch (version) {
      case 'v0.9': {
        const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
        const identityOwnerAddressHdNode = identityPrivateKeychainNode
        .deriveHardened(addressIndex).derive(0)
        return {
          address: identityOwnerAddressHdNode.getAddress(),
          key: identityOwnerAddressHdNode.keyPair.d.toBuffer(32).toString('hex')
        }
      }
      case 'current':
      default: {
        const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
        const identityOwnerAddressNode =
        getIdentityOwnerAddressNode(identityPrivateKeychainNode, addressIndex)
        return deriveIdentityKeyPair(identityOwnerAddressNode)
      }
    }
  }

  getOhNine

  render() {
    const results = this.state.results
    return (
      <div className="m-b-100">
        <h1 className="h1-modern m-t-10" style={{ paddingLeft: '15px' }}>
          Name Migration Tool
        </h1>
        {
          this.state.alerts.map((alert, index) =>
            (
            <Alert key={index} message={alert.message} status={alert.status} />
            )
          )
        }
        <div>
          <form onSubmit={this.search}>
            <p style={{ paddingLeft: '15px' }}>
              <i>This tool lets you search for names owned by addresses from
                earlier browser keychain formats and generate the private keys
                for those names.
              </i>
            </p>

            <InputGroup
              name="backupPhrase" label="Identity Key" type="text"
              data={this.state} onChange={this.onChange}
            />
            <InputGroup
              name="password" label="Password" type="password"
              data={this.state} onChange={this.onChange}
            />
            <InputGroup
              name="number" label="Number of names to search for" type="number"
              data={this.state} onChange={this.onChange} required step={1}
            />
            <div className="container m-t-40">
              <button className="btn btn-secondary" onClick={this.decryptBackupPhrase}>
                Use current identity key
              </button>
              <button className="btn btn-primary" type="submit">
                Search for names
              </button>
            </div>
          </form>
        </div>
        {
          KEYCHAIN_VERSIONS.map((version) => {
            const thisResults = results[version]
            return (<div>
              <h2>{version} keychain</h2>
              <table
                style={tableStyle}
              >
                <tr>
                  <td>Address</td>
                  <td>Private key</td>
                </tr>
                {
                  thisResults && thisResults.length ?
                    <tbody>
                      {
                        thisResults.map((keyPair) =>
                         (
                          <tr>
                            <td>
                              <a
                                href={`https://explorer.blockstack.org/address/${keyPair.address}`}
                                target="_blank"
                              >
                                {keyPair.address}
                              </a>
                            </td>
                            <td>{keyPair.key}</td>
                          </tr>
                        )
                      )
                      }
                    </tbody>
                  :
                    <tr>
                      <td colSpan="3">None</td>
                    </tr>
                }
              </table>
            </div>)
        })
      }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MigrationToolPage)
