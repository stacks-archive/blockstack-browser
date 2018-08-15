import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import bip39 from 'bip39'
import { HDNode } from 'bitcoinjs-lib'

import Alert from '@components/Alert'
import SimpleButton from '@components/SimpleButton'
import InputGroup from '@components/InputGroup'
import { decrypt } from '@utils'
import log4js from 'log4js'

import { AccountActions } from './store/account'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  const actions = Object.assign({}, AccountActions)
  return bindActionCreators(actions, dispatch)
}

class BackupAccountPage extends Component {
  static propTypes = {
    encryptedBackupPhrase: PropTypes.string.isRequired,
    displayedRecoveryCode: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      decryptedBackupPhrase: null,
      password: '',
      alerts: [],
      keychain: null,
      isDecrypting: false
    }

    this.onChange = this.onChange.bind(this)
    this.decryptBackupPhrase = this.decryptBackupPhrase.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  onChange(event) {
    if (event.target.name === 'password') {
      this.setState({
        password: event.target.value
      })
    }
  }

  updateAlert(alertStatus, alertMessage) {
    logger.info(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase() {
    logger.info('decryptBackupPhrase')

    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    this.setState({ isDecrypting: true })

    logger.debug('Trying to decrypt recovery phrase...')
    decrypt(dataBuffer, password).then(
      plaintextBuffer => {
        logger.debug('Keychain phrase successfully decrypted')
        this.updateAlert('success', 'Keychain phrase decrypted')
        const seed = bip39.mnemonicToSeed(plaintextBuffer.toString())
        const keychain = HDNode.fromSeedBuffer(seed)
        this.props.displayedRecoveryCode()
        this.setState({
          isDecrypting: false,
          decryptedBackupPhrase: plaintextBuffer.toString(),
          keychain
        })
      },
      () => {
        logger.error('Invalid password')
        this.updateAlert('danger', 'Invalid password')
        this.setState({ isDecrypting: false })
      }
    )
  }

  render() {
    const { alerts, keychain, decryptedBackupPhrase, isDecrypting } = this.state
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h3>Backup Keychain</h3>
              {alerts.map((alert, index) => (
                <Alert key={index} message={alert.message} status={alert.status} />
              ))}
            </div>
          </div>
        </div>
        {decryptedBackupPhrase ? (
          <div className="container-fluid m-b-100">
            <div className="row">
              <div className="col">
                <p>
                  <i>
                    Write down the keychain phrase below and keep it safe. Anyone who has it will be
                    able to access to your keychain.
                  </i>
                </p>

                <div className="card">
                  <div className="card-header">Keychain Phrase</div>
                  <div className="card-block backup-phrase-container">
                    <p className="card-text">{decryptedBackupPhrase}</p>
                  </div>
                </div>

                <div className="card m-t-20">
                  <div className="card-header">Private Key (WIF)</div>
                  <div className="card-block backup-phrase-container">
                    <p className="card-text">{keychain.keyPair.toWIF()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-fluid p-0 m-b-100">
            <div className="row">
              <div className="col">
                <p className="container-fluid">
                  <i>
                    Enter your password to view your keychain phrase and write down your keychain
                    phrase.
                  </i>
                </p>
                <InputGroup
                  name="password"
                  label="Password"
                  type="password"
                  data={this.state}
                  onChange={this.onChange}
                  onReturnKeyPress={this.decryptBackupPhrase}
                />
                <div className="container-fluid m-t-40">
                  <SimpleButton
                    type="primary"
                    loading={isDecrypting}
                    onClick={this.decryptBackupPhrase}
                    block
                  >
                    Display Keychain Phrase
                  </SimpleButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupAccountPage)
