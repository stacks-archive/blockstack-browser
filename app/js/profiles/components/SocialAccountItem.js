import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    pending: PropTypes.bool,
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
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

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const webAccountType = webAccountTypes[this.props.service]
    const verified = this.props.verified
    const pending = this.props.pending

    if (webAccountType) {
      let accountServiceName = webAccountType.label
      if (this.props.listItem === true) {
        return (
          <li className={verified ? "verified" : "pending"}>  
            {!pending && 
              <ReactTooltip 
                place="top" 
                type="dark" 
                effect="solid" 
                id={`verified-${this.props.service}`} 
                className="text-center">
                {verified && 'Verified'}
              </ReactTooltip>
            }
            <a href={this.getAccountUrl()} data-toggle="tooltip"
              title={webAccountTypes[this.props.service].label}>
              <span className="">
                <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
              </span>
              <span className="app-account-identifier">
                {this.getIdentifier()}
              </span>
              <span className="app-account-service font-weight-normal">
                {`@${accountServiceName}`}
              </span>
              {verified ?
                <span className="float-right status" data-tip data-for={`verified-${this.props.service}`}>
                  <i className="fa fa-fw fa-check-circle fa-lg" />
                </span>
                : 
                (pending) ? <span></span> :
                <span className="float-right badge badge-danger badge-verification">Unverified
                </span> 
              }
            </a>
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
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(SocialAccountItem)
