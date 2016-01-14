import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import * as IdentityActions from '../actions/identities'

function mapStateToProps(state) {
  return {
    username: ''
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    createNewIdentity: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      username: this.props.username,
      type: 'person',
      tlds: {
        person: 'id',
        organization: 'corp'
      },
      nameLabels: {
        person: 'Username',
        organization: 'Domain'
      }
    }

    this.onChange = this.onChange.bind(this)
    this.registerIdentity = this.registerIdentity.bind(this)
  }

  onChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  registerIdentity(event) {
    if (this.state.username === '') {
      return
    }
    var blockchainId = this.state.username + '.' + this.state.tlds[this.state.type]
    this.props.createNewIdentity(blockchainId)
  }

  render() {
    var tld = this.state.tlds[this.state.type],
        nameLabel = this.state.nameLabels[this.state.type]

    return (
      <div>
        <div>
          <h3>Register Identity</h3>

            <fieldset className="form-group">
              <select name="type" className="c-select"
                defaultValue={this.state.type} onChange={this.onChange}>
                <option value="person">Person</option>
                <option value="organization">Organization</option>
              </select>
            </fieldset>

            <fieldset className="form-group">
              <label className="capitalize">{nameLabel}</label>
              <div className="input-group">
                <input
                  name="username"
                  className="form-control"
                  placeholder={nameLabel}
                  defaultValue={this.state.username}
                  onChange={this.onChange} />
                <span className="input-group-addon">.{tld}</span>
              </div>
            </fieldset>

            <div>
              <button className="btn btn-primary" onClick={this.registerIdentity}>
                Register
              </button>
            </div>

        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)

/*
<div>
  <label>Cost</label>

  <pre><code>$2</code></pre>

  <p><i>Note: this amount will be pulled from your local Bitcoin balance.</i></p>
</div>
*/