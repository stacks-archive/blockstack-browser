import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { isBackupPhraseValid } from '../../utils'
import InputGroup from '../../components/InputGroup'
import { AccountActions } from '../../account/store/account'

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class RestoreView extends Component {
  static propTypes = {
    showLandingView: PropTypes.func.isRequired,
    initializeWallet: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      identityKeyPhrase: ''
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.restoreAccount = this.restoreAccount.bind(this)
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  restoreAccount(event) {
    event.preventDefault()
    const { isValid, error } = isBackupPhraseValid(this.state.identityKeyPhrase)

    if (!isValid) {
      this.updateAlert('danger', error)
      return
    }
    // TODO: we're removing password, so hardcoding password until we refactor
    this.props.initializeWallet('password', this.state.identityKeyPhrase)
  }

  render() {
    return (
      <div>
        <h4>Restore your account by typing in your identity key</h4>
        <p>Type your identity key here:</p>
        <InputGroup
          name="identityKeyPhrase"
          type="text"
          label="Identity key"
          placeholder="Identity key"
          data={this.state}
          onChange={this.onValueChange}
        />
        <div className="container m-t-40">
          <button className="btn btn-primary" onClick={this.restoreAccount}>
            Restore account
          </button>
          <br />
          <a href="#" onClick={this.props.showLandingView}>
            Create new account
          </a>
        </div>
      </div>
    )
  }
 }

export default connect(null, mapDispatchToProps)(RestoreView)
