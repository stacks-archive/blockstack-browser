import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import InputGroup from '../components/InputGroup'
import * as IdentityActions from '../actions/identities'
import { getNameCost } from '../utils/blockstore-utils'
import { isNameAvailable, hasNameBeenPreordered } from '../utils/name-utils'

function mapStateToProps(state) {
  return {
    username: '',
    preorderedIdentities: state.identities.preordered
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    createNewIdentity: PropTypes.func.isRequired,
    preorderedIdentities: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      username: this.props.username,
      nameCost: 0,
      alertMessage: null,
      alertStatus: null,
      type: 'person',
      tlds: {
        person: 'id',
        organization: 'corp'
      },
      nameLabels: {
        person: 'Username',
        organization: 'Domain'
      },
      nameLookupUrl: 'https://api.onename.com/v1/users/'
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
    const _this = this

    const username = this.state.username
    const tld = this.state.tlds[this.state.type]
    const fullyQualifiedId = username + '.' + tld
    
    if (username.length === 0) {
      this.setState({
        alertMessage: 'Name must have at least one character',
        alertStatus: 'danger'
      })
      return
    }

    const nameHasBeenPreordered = hasNameBeenPreordered(fullyQualifiedId, this.props.preorderedIdentities)

    if (nameHasBeenPreordered) {
      this.setState({
        alertMessage: 'Name has already been preordered',
        alertStatus: 'danger'
      })
    } else {
      isNameAvailable(this.state.nameLookupUrl, fullyQualifiedId, function(isAvailable) {
        if (!isAvailable) {
          _this.setState({
            alertMessage: 'Name has already been registered',
            alertStatus: 'danger'
          })
        } else {
          _this.setState({
            alertMessage: 'Name preordered! Waiting for registration confirmation.',
            alertStatus: 'success'
          })
          _this.props.createNewIdentity(fullyQualifiedId)
        }
      })
    }
  }

  render() {
    var tld = this.state.tlds[this.state.type],
        nameLabel = this.state.nameLabels[this.state.type]

    return (
      <div>
        <div>
          <h3>Register Identity</h3>

            {
              this.state.alertMessage ?
              <div className={"alert alert-" + this.state.alertStatus}>
                {this.state.alertMessage}
              </div>
              : null
            }

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
<fieldset className="form-group">
  <select name="type" className="c-select"
    defaultValue={this.state.type} onChange={this.onChange}>
    <option value="person">Person</option>
    <option value="organization">Organization</option>
  </select>
</fieldset>
*/