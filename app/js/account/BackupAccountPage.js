import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import bip39 from 'bip39'
import { HDNode } from 'bitcoinjs-lib'
import QRCode from 'qrcode.react'

import Alert from '@components/Alert'
import SimpleButton from '@components/SimpleButton'
import InputGroup from '@components/InputGroup'
import { decrypt } from '@utils'
import log4js from 'log4js'

import { AccountActions } from './store/account'

const logger = log4js.getLogger('account/BackupAccountPage.js')

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
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  decryptBackupPhrase() {
    logger.trace('decryptBackupPhrase')

    const password = this.state.password
    const dataBuffer = new Buffer(this.props.encryptedBackupPhrase, 'hex')
    this.setState({ isDecrypting: true })

    logger.debug('Trying to decrypt recovery phrase...')
    decrypt(dataBuffer, password).then(
      plaintextBuffer => {
        logger.debug('Keychain phrase successfully decrypted')
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
    const b64EncryptedBackupPhrase = new Buffer(
      this.props.encryptedBackupPhrase,
      'hex'
    ).toString('base64')

    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h3>Magic Recovery Code</h3>
              <p>
                <i>
                  Scan or enter the recovery code with your password to restore
                  your account or sign in on other devices.
                </i>
              </p>
            </div>
          </div>
          <div className="row m-b-50">
            <div className="col col-sm-4 col-12">
              <QuickQR data={b64EncryptedBackupPhrase} />
            </div>
            <div className="col col-sm-8 col-12">
              <div className="card">
                <div className="card-header">Recovery Code</div>
                <div className="card-block backup-phrase-container">
                  <p className="card-text">
                    <code>{b64EncryptedBackupPhrase}</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col">
              {alerts.map((alert, index) => (
                <Alert key={index} message={alert.message} status={alert.status} />
              ))}
              <h3>Secret Recovery Key</h3>
            </div>
          </div>
        </div>
        {decryptedBackupPhrase ? (
          <div className="container-fluid m-b-100">
            <div className="row">
              <div className="col">
                <p>
                  <i>
                    Write down the secret phrase below and keep it safe, or scan
                    it to recover your account. Anyone who has it will have full
                    access your Blockstack ID, so keep it safe!
                  </i>
                </p>
              </div>
            </div>

            <div className="row">
              <div className="col col-sm-4 col-12">
                <QuickQR data={decryptedBackupPhrase} />
              </div>
              <div className="col col-sm-8 col-12">
                <div className="card">
                  <div className="card-header">Secret Recovery Key</div>
                  <div className="card-block backup-phrase-container">
                    <p className="card-text">
                      <code>{decryptedBackupPhrase}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <hr className="m-t-40 m-b-50" />

            <div className="row">
              <div className="col">
                <p>
                  <strong>Info for Developers</strong>
                </p>
                <p>
                  Private Key (WIF) — <code>{keychain.keyPair.toWIF()}</code>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-fluid p-0 m-b-100">
            <div className="row">
              <div className="col">
                <p className="container-fluid">
                  <i>
                    Enter your password to view and backup your secret recovery phrase.
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

const QuickQR = ({ data }) => (
  <div
    className="qr-wrap"
    style={{
      maxWidth: 320,
      padding: 20,
      margin: '0 auto 20px',
      borderRadius: 4,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
    }}
  >
    <QRCode value={data} size="256" style={{ width: '100%' }} />
  </div>
)

QuickQR.propTypes = {
  data: PropTypes.string
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupAccountPage)
