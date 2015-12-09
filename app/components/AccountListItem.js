import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

class AccountListItem extends Component {
  static propTypes = {
    serviceName: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired
  }

  render() {
    var fontAwesomeClass = 'fa '
    var serviceNames = ['twitter', 'facebook', 'github']
    if (serviceNames.indexOf(this.props.serviceName) >= 0) {
      fontAwesomeClass += 'fa-' + this.props.serviceName
    }

    var accountUrl = 'http://' + this.props.serviceName + '.com/' + this.props.identifier

    return (
      <li>
        <Link to={accountUrl}>
          <i className={fontAwesomeClass} />
          <span>{this.props.username}</span>
        </Link>
      </li>
    )
  }
}

export default AccountListItem