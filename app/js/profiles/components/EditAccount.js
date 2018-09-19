import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import InputGroup from '@components/InputGroup'

import { getWebAccountTypes } from '@utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

export class EditAccount extends Component {
  static propTypes = {
    service: PropTypes.string,
    identifier: PropTypes.string,
    api: PropTypes.object.isRequired,
    onDoneButtonClick: PropTypes.func,
    verified: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      identifier: props.identifier
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      identifier: nextProps.identifier
    })
  }

  getAccountUrl = () => {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        const urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getIconClass = () => {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier = () => {
    let identifier = this.state.identifier
    if (identifier.length >= 40) {
      identifier = `${identifier.slice(0, 40)}...`
    }
    return identifier
  }

  onIdentifierChange = (event) => {
    const identifier = event.target.value
    this.setState({
      identifier
    })
  }

  getIdentifierType = (service) => {
    if(service === 'bitcoin' || service === 'ethereum') {
      return 'address'
    }
    else if (service === 'pgp' || service === 'ssh') {
      return 'key'
    }
    else {
      return 'account'
    }
  }

  getPlaceholderText = (service) => {
    if(service === 'bitcoin' || service === 'ethereum') {
      return (
        <span className="app-account-service font-weight-bold">
          Add your <span className="text-capitalize">{service}</span> address
        </span>
      )
    }
    else if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-bold">
          Add your {service.toUpperCase()} key
        </span>
      )
    }
    else {
      return (
        <span className="app-account-service font-weight-bold">
          Add your <span className="text-capitalize">{service}</span> account
        </span>
      )
    }
  }

  capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const unverifiedClass = (this.state.collapsed ? 'pending' : '')
    const verifiedClass = this.props.verified ? 'verified' : unverifiedClass 
    const webAccountType = webAccountTypes[this.props.service]

    if (webAccountType) {
      return (
        <div>
          <div
            className={`profile-account ${verifiedClass}`}
            onClick={this.handleClick}
          >
            <div className='heading m-b-30'>
              <i className={`fa fa-fw fa-lg ${this.getIconClass()}`} />
              {this.getPlaceholderText(this.props.service)}
            </div>

            <div>
              <InputGroup
                key='input-group-identifier'
                name='identifier'
                placeholder={this.capitalize(this.getIdentifierType(this.props.service))}
                data={this.state}
                stopClickPropagation
                onChange={this.onIdentifierChange}
              />

            </div>
          </div>
          <button
            className='btn btn-verify btn-block m-t-15'
            onClick={() => this.props.onDoneButtonClick(this.props.service, 
		    this.state.identifier)}
          >
            Save
          </button>
        </div>
      )
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditAccount)
