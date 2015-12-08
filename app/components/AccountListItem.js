import React, { Component } from 'react';
import { Link } from 'react-router';

class AccountListItem extends Component {
  openTab(e) {
    console.log(e)
  }

  render() {
    var fontAwesomeClass = 'fa '
    var serviceNames = ['twitter', 'facebook', 'github']
    if (serviceNames.indexOf(this.props.serviceName) >= 0) {
      fontAwesomeClass += 'fa-' + this.props.serviceName
    }

    var accountUrl = 'http://' + this.props.service + '.com/' + this.props.identifier

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