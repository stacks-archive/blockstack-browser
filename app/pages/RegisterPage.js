import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'
import { IdentityActions } from '../store/identities'
import { getNameCost, isNameAvailable, hasNameBeenPreordered } from '../utils/name-utils'

function mapStateToProps(state) {
  return {
    username: '',
    localIdentities: state.identities.local,
    lookupUrl: state.settings.api.nameLookupUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    createNewIdentity: PropTypes.func.isRequired,
    localIdentities: PropTypes.array.isRequired,
    lookupUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      username: this.props.username,
      nameCost: 0,
      alerts: [],
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
    this.updateAlert = this.updateAlert.bind(this)
  }

  onChange(event) {
    if (event.target.name === 'username') {
      const username = event.target.value.toLowerCase().replace(/\W+/g, '')
      const tld = this.state.tlds[this.state.type]
      const nameCost = getNameCost(`${username}.${tld}`) / 1000
      this.setState({
        username: username,
        nameCost: nameCost
      })
    }
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  registerIdentity(event) {
    const username = this.state.username,
          tld = this.state.tlds[this.state.type],
          domainName = username + '.' + tld
    
    if (username.length === 0) {
      this.updateAlert('danger', 'Name must have at least one character')
      return
    }

    const nameHasBeenPreordered = hasNameBeenPreordered(
      domainName, this.props.localIdentities)

    if (nameHasBeenPreordered) {
      this.updateAlert('danger', 'Name has already been preordered')
    } else {
      isNameAvailable(this.props.lookupUrl, domainName, (isAvailable) => {
        if (!isAvailable) {
          this.updateAlert('danger', 'Name has already been registered')
        } else {
          this.updateAlert('success', 'Name preordered! Waiting for registration confirmation.')
          this.props.createNewIdentity(domainName)
        }
      })
    }
  }

  render() {
    let tld = this.state.tlds[this.state.type],
        nameLabel = this.state.nameLabels[this.state.type]

    return (
      <div>
        <div>
          <h3>Register Identity</h3>
            { this.state.alerts.map(function(alert, index) {
              return (
                <Alert key={index} message={alert.message} status={alert.status} />
              )
            })}
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