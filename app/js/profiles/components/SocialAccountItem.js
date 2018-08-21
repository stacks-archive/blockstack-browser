import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { openInNewTab, getWebAccountTypes } from '@utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    editing: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    pending: PropTypes.bool,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool,
    onClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    // this.onClick = this.onClick.bind(this)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        const urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace(
            '{identifier}',
            this.props.identifier
          )
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
      identifier = `${identifier.slice(0, 40)}...`
    }
    return identifier
  }

  getPlaceholderText(service) {
    if (service === 'bitcoin' || service === 'ethereum') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> address
        </span>
      )
    } else if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your {service.toUpperCase()} key
        </span>
      )
    } else {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> account
        </span>
      )
    }
  }

  onClick = () => {
    this.props.onClick(this.props.service)
  }

  onVerifiedCheckmarkClick = e => {
    e.preventDefault()
    e.stopPropagation()
    openInNewTab(this.props.proofUrl)
  }

  render() {
    const { verified, pending, placeholder } = this.props
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const webAccountType = webAccountTypes[this.props.service]
    const verifiedClass = verified ? 'verified' : 'pending'
    const placeholderClass = placeholder ? 'placeholder' : ''

    const EditButton = () => (
      <span className="">
        <i className="fa fa-fw fa-pencil" />
      </span>
    )

    if (webAccountType) {
      const accountServiceName = webAccountType.label
      if (this.props.listItem === true) {
        return (
          <li
            className={`clickable ${verifiedClass} ${placeholderClass}`}
            onClick={this.onClick}
          >
            {!pending && (
              <ReactTooltip
                place="top"
                type="dark"
                effect="solid"
                id={`verified-${this.props.service}`}
                className="text-center"
              >
                {verified && 'Verified'}
              </ReactTooltip>
            )}

            <span className="app-account-icon">
              <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
            </span>

            {!this.props.placeholder && (
              <span className="app-account-identifier">
                {this.getIdentifier()}
              </span>
            )}

            {!this.props.placeholder && this.props.editing && <EditButton />}

            {!placeholder && (
              <span className="app-account-service font-weight-normal">
                {`@${accountServiceName}`}
              </span>
            )}

            {placeholder && (
              <span className="app-account-service font-weight-normal">
                {this.getPlaceholderText(this.props.service)}
              </span>
            )}

            {verified && (
              <span
                className="float-right status"
                data-tip
                data-for={`verified-${this.props.service}`}
                onClick={this.onVerifiedCheckmarkClick}
              >
                <i className="fa fa-fw fa-check-circle fa-lg" />
              </span>
            )}
            {!verified && placeholder ? (
              <span className="float-right star">
                +1<i className="fa fa-w fa-star-o" />
              </span>
            ) : (
              !verified && (
                <span className="float-right badge badge-danger badge-verification">
                  Unverified
                </span>
              )
            )}
          </li>
        )
      } else {
        return (
          <span>
            <i className={`fa ${this.getIconClass()}`} />
            <span>{this.getIdentifier()}</span>
          </span>
        )
      }
    } else {
      return <span />
    }
  }
}

export default connect(mapStateToProps, null)(SocialAccountItem)
