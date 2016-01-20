import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class AccountListItem extends Component {
  static propTypes = {
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string
  }

  render() {
    var fontAwesomeClass = 'fa '
    var serviceNames = ['bitcoin', 'twitter', 'facebook', 'github']
    if (serviceNames.indexOf(this.props.service) >= 0) {
      fontAwesomeClass += 'fa-' + this.props.service
    }

    var accountUrl = 'http://' + this.props.service + '.com/' + this.props.identifier

    return (
      <li>
        <Link to={accountUrl}>
          <i className={fontAwesomeClass} />
          <span>{this.props.identifier}</span>
        </Link>
      </li>
    )
  }
}

export default AccountListItem