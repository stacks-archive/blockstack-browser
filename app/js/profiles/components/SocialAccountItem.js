import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import { openInNewTab, getWebAccountTypes, getIconClass, getIdentifier, getIdentifierType } from '@utils'

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

  getPlaceholderText = (service) => (
    <span className="app-account-service font-weight-normal">
      Prove your <span className="text-capitalize">{service}</span> {getIdentifierType(service)}
    </span>
  )

  onClick = () => {
    this.props.onClick(this.props.service)
  }

  onVerifiedCheckmarkClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    openInNewTab(this.props.proofUrl)
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const webAccountType = webAccountTypes[this.props.service]
    const verified = this.props.verified
    const pending = this.props.pending
    const verifiedClass = verified ? 'verified' : 'pending'
    const placeholderClass = this.props.placeholder ? 'placeholder' : ''
    const accountServiceName = webAccountType.label

    if (!webAccountType || this.props.listItem !== true) {
      return <span></span>
    }
    return (
      <li className={`clickable ${verifiedClass} ${placeholderClass}`} onClick={this.onClick}>
        {!pending &&
          <ReactTooltip
            place="top"
            type="dark"
            effect="solid"
            id={`verified-${this.props.service}`}
            className="text-center"
          >
            {verified && 'Verified'}
          </ReactTooltip>
        }

        <span className="app-account-icon">
          <i className={`fa fa-fw ${getIconClass(this.props.api, this.props.service)} fa-lg`} />
        </span>

        {!this.props.placeholder && (
          <span className="app-account-identifier">
            {getIdentifier(this.props.identifier)}
          </span>
        )}

        {(!this.props.placeholder && this.props.editing) && (
          <span className="">
            <i className="fa fa-fw fa-pencil" />
          </span>
        )}

        {!this.props.placeholder && (
          <span className="app-account-service font-weight-normal">
            {`@${accountServiceName}`}
          </span>
        )}

        {this.props.placeholder && (
          <span className="app-account-service font-weight-normal">
            {this.getPlaceholderText(this.props.service)}
          </span>
        )}

        {verified &&
          <span
            className="float-right status"
            data-tip
            data-for={`verified-${this.props.service}`}
            onClick={this.onVerifiedCheckmarkClick}
          >
            <i className="fa fa-fw fa-check-circle fa-lg" />
          </span>
        }
        {!verified && 
          (this.props.placeholder) ?
          <span className="float-right star">+1<i className="fa fa-w fa-star-o" /></span>
          :
          <span className="float-right badge badge-danger badge-verification">Unverified</span>
        }
      </li>
    )
  }
}

export default connect(mapStateToProps, null)(SocialAccountItem)
