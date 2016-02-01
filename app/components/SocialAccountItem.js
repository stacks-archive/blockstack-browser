import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

class SocialAccountListItem extends Component {
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
      ['github', 'fa-github'],
      ['linkedin', 'fa-linkedin'],
      ['instagram', 'fa-instagram'],
      ['pinterest', 'fa-pinterest'],
      ['reddit', 'fa-reddit'],
      ['snapchat', 'fa-star-o'],
      ['stack-overflow', 'fa-stack-overflow'],
      ['angellist', 'fa-angellist'],
      ['hacker-news', 'fa-hacker-news']
    ])
    let socialMediaClass = ''
    if (socialMediaClasses.has(this.props.service)) {
      socialMediaClass = socialMediaClasses.get(this.props.service)
    }
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`

    let identifier = this.props.identifier
    if (identifier.length >= 18) {
      identifier = identifier.slice(0, 18) + '...'
    }

    return (
      <li>
        <Link to={accountUrl}>
          <i className={`fa ${socialMediaClass}`} />
          <span>{identifier}</span>
        </Link>
      </li>
    )
  }
}

export default SocialAccountListItem