import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import * as IdentityActions from '../actions/identities'
import { getNameCost } from '../utils/blockstore-utils'

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
      nameCost: 0,
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
    if (event.target.name === 'username') {
      const username = event.target.value.toLowerCase().replace(/\W+/g, '')
      const tld = this.state.tlds[this.state.type]
      const nameCost = getNameCost(username + '.' + tld) / 1000
      this.setState({
        username: username,
        nameCost: nameCost
      })
    }
  }

  registerIdentity(event) {
    if (this.state.username.length === 0) {
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
                  value={this.state.username}
                  onChange={this.onChange} />
                <span className="input-group-addon">.{tld}</span>
              </div>
            </fieldset>

            <div>
              <label>Registration Cost</label>

              <div className="highlight">
                <pre>
                  <code>
                    {this.state.nameCost} mBTC
                  </code>
                </pre>
              </div>
            </div>

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

*/