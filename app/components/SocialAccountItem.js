import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { shell } from 'electron'

import { webAccountTypes } from '../utils'

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
  }

  getAccountUrl() {
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (this.props.service === 'bitcoin') {
      accountUrl = `https://www.blocktrail.com/BTC/address/${this.props.identifier}`
    } else if (this.props.service === 'openbazaar') {
      accountUrl = `ob://${this.props.identifier}`
    } else if (this.props.service === 'snapchat') {
      accountUrl = `https://snapchat.com/add/${this.props.identifier}`
    }
    return accountUrl
  }

  getIconClass() {
    let iconClass = ''
    console.log(webAccountTypes)
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
          <a href="#" onClick={(event) => {
            event.preventDefault()
            shell.openExternal(this.getAccountUrl())
          }}>
            <i className={`fa ${this.getIconClass()}`} />
            <span>{this.getIdentifier()}</span>
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