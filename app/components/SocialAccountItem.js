import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { shell } from 'electron'

class SocialAccountListItem extends Component {
  static propTypes = {
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    proofUrl: PropTypes.string
  }

  render() {
    let socialMediaClasses = new Map([
      ['twitter', 'fa-twitter'],
      ['facebook', 'fa-facebook'],
      ['github', 'fa-github'],
      ['linkedin', 'fa-linkedin'],
      ['instagram', 'fa-instagram'],
      ['pinterest', 'fa-pinterest'],
      ['reddit', 'fa-reddit'],
      ['youtube', 'fa-youtube'],
      ['tumblr', 'fa-tumblr'],
      ['google-plus', 'fa-google-plus'],
      ['stack-overflow', 'fa-stack-overflow'],
      ['angellist', 'fa-angellist'],
      ['hacker-news', 'fa-hacker-news'],
      ['bitcoin', 'fa-bitcoin'],
      ['pgp', 'fa-key'],
      ['website', 'fa-link']
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
        <button onClick={() => {
          shell.openExternal(accountUrl)
        }} className="btn btn-outline-primary">
          <i className={`fa ${socialMediaClass}`} />
          <span>{identifier}</span>
        </button>
      </li>
    )
  }
}

export default SocialAccountListItem