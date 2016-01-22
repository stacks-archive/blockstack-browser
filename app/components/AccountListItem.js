import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class AccountListItem extends Component {
  static propTypes = {
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string
  }

  render() {
    let socialMediaClasses = new Map([
      ['bitcoin', 'fa-bitcoin'],
      ['twitter', 'fa-twitter'],
      ['facebook', 'fa-facebook'],
      ['github', 'fa-github']
    ])
    let socialMediaClass = ''
    if (socialMediaClasses.has(this.props.service)) {
      socialMediaClass = socialMediaClasses.get(this.props.service)
    }
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`

    return (
      <li>
        <Link to={accountUrl}>
          <i className={`fa ${socialMediaClass}`} />
          <span>{this.props.identifier}</span>
        </Link>
      </li>
    )
  }
}

export default AccountListItem