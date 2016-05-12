import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { shell } from 'electron'

import { socialMediaClasses } from '../utils'

class SocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string
  }

  render() {

    let socialMediaClass = ''
    if (socialMediaClasses.has(this.props.service)) {
      socialMediaClass = socialMediaClasses.get(this.props.service)
    }
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (this.props.service === 'bitcoin') {
      accountUrl = `https://www.blocktrail.com/BTC/address/${this.props.identifier}`
    } else if (this.props.service === 'openbazaar') {
      accountUrl = `ob://${this.props.identifier}`
    }

    let identifier = this.props.identifier
    if (identifier.length >= 15) {
      identifier = identifier.slice(0, 15) + '...'
    }

    if (this.props.listItem === true) {
      return (
        <li>
          <a href="#" onClick={(event) => {
            event.preventDefault()
            shell.openExternal(accountUrl)
          }}>
            <i className={`fa ${socialMediaClass}`} />
            <span>{identifier}</span>
          </a>
        </li>
      )
    } else {
      return (
        <span>
          <i className={`fa ${socialMediaClass}`} />
          <span>{identifier}</span>
        </span>
      )
    }
  }
}

export default SocialAccountItem