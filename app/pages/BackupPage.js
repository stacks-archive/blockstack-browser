import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import * as KeychainActions from '../actions/keychain'
import { decrypt } from '../utils/keychain-utils'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

class BackupPage extends Component {
  static propTypes = {
    encryptedMnemonic: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      decryptedMnemonic: null,
      password: '',
      error: null
    }

    this.onChange = this.onChange.bind(this)
    this.decryptBackupPhrase = this.decryptBackupPhrase.bind(this)
  }

  onChange(event) {
    if (event.target.name === 'password') {
      this.setState({
        password: event.target.value
      })
    }
  }

  decryptBackupPhrase() {
    const _this = this
    const password = this.state.password
    decrypt(new Buffer(this.props.encryptedMnemonic, 'hex'), password, function(err, plaintextBuffer) {
      if (!err) {
        _this.setState({
          decryptedMnemonic: plaintextBuffer.toString(),
          error: null
        })
      } else {
        _this.setState({
          error: 'Invalid password'
        })
      }
    })
  }

  render() {
    return (
      <div>
        <div>
          <h2>Backup Account</h2>

          {
            this.state.error ?
            <div className="alert alert-danger">
              {this.state.error}
            </div>
            : null
          }

          {
            this.state.decryptedMnemonic ?
            <div>
              <p>
                <i>
                  Write down the backup phrase below and keep it safe.
                  Anyone who has it will be able to regain access to your account.
                </i>
              </p>

              <div className="highlight">
                <pre>
                  <code>{this.state.decryptedMnemonic}</code>
                </pre>
              </div>
            </div>
            :
            <div>
              <p>
                <i>Enter your password to view your backup phrase and backup your account.</i>
              </p>

              <fieldset>
                <InputGroup name="password" label="Password" type="password"
                  data={{}} onChange={this.onChange} />
              </fieldset>

              <div>
                <button className="btn btn-primary" onClick={this.decryptBackupPhrase}>
                  Decrypt Backup Phrase
                </button>
              </div>
            </div>
          }

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps)(BackupPage)
