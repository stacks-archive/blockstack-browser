import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { shell } from 'electron'

import { webAccountTypes } from '../utils'

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    this.openExternalLink = this.openExternalLink.bind(this)
  }

  getAccountUrl() {
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        let urlTemplate = webAccountTypes[this.props.service].urlTemplate
        accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
      }
    }
    return accountUrl
  }

  openExternalLink(event) {
    event.preventDefault()
    shell.openExternal(this.getAccountUrl())
  }

  getIconClass() {
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier() {
    let identifier = this.props.identifier
    if (identifier.length >= 15) {
      identifier = identifier.slice(0, 15) + '...'
    }
    return identifier
  }

  render() {
    if (this.props.listItem === true) {
      return (
        <li>
          <a href="#" data-toggle="tooltip"
            title={webAccountTypes[this.props.service].label}
            onClick={this.openExternalLink}>
            {this.props.verified ?
            <span className="fa-stack fa-lg">
              <i className="fa fa-certificate fa-stack-2x fa-green" />
              <i className={`fa ${this.getIconClass()} fa-stack-1x`} />
            </span>
            :
            <span className="fa-stack fa-lg">
              <i className={`fa ${this.getIconClass()} fa-stack-1x`} />
            </span>
            }
            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>
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
  }
}

export default SocialAccountItem