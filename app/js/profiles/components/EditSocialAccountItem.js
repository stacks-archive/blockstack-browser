import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import InputGroup from '../../components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditSocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
      showVerificationInstructions: false,
      identifier: props.identifier,
    }

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onIdentifierChange = this.onIdentifierChange.bind(this)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        let urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getIconClass() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier() {
    let identifier = this.props.identifier
    if (identifier.length >= 40) {
      identifier = identifier.slice(0, 40) + '...'
    }
    return identifier
  }

  handleClick() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  onIdentifierChange(event) {
    if (this.props.onChange) {
      this.props.onChange(this.props.service, event)
    }
  }

  getPlaceholderText(service) {
    if(service === 'bitcoin' || service === 'ethereum') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> address
        </span>
      )
    }
    else if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your {service.toUpperCase()} key
        </span>
      )
    }
    else {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> account
        </span>
      )
    }
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const placeholderClass = this.props.placeholder ? "placeholder" : ""
    const verifiedClass = !this.props.verified ? "verified" : "pending" 
    const collapsedClass = this.state.collapsed ? "collapsed" : ""

    if (webAccountTypes[this.props.service]) {
      if (this.props.listItem === true) {
        return (
          <div className={`account ${placeholderClass} ${verifiedClass} ${collapsedClass}`} 
            onClick={this.handleClick}>
            <span className="">
              <i className={`fa fa-fw ${this.getIconClass()}`} />
            </span>
            { !this.props.placeholder && (
                <span className="app-account-identifier">
                  {this.getIdentifier()}
                </span>
              )}

            { !this.props.placeholder && (
                <span className="app-account-service font-weight-normal">
                  {`@${this.props.service}`}
                </span>
              )}

            { this.props.placeholder && (
                <span className="app-account-service font-weight-normal">
                  { this.getPlaceholderText(this.props.service) }
                </span>
              )}

            <span className="float-right">
              { this.state.collapsed ? <i className="fa fa-w fa-chevron-down" /> : 
                <i className="fa fa-w fa-chevron-up" />
              }
            </span>

            {!this.state.collapsed && 
              (
                <div>
                  <InputGroup 
                    name="identifier" 
                    label="Username" 
                    data={this.props}
                    stopClickPropagation={true} 
                    onChange={this.onIdentifierChange} />
                </div>
              )
            }

            {this.state.showVerificationInstructions && 
              (
                <div>
                  <VerificationInfo
                    service={this.props.service}
                    domainName={this.getIdentifier()} />
                </div>
              )
            }
          </div>
        )
      } else {
        return (
          <div></div>
        )
      }
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditSocialAccountItem)
