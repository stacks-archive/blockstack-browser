import React, { Component, PropTypes } from 'react'

import { openInNewTab } from '../../utils'

class FacebookVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationMessage = "Verifying that \"{{ username }}.id\" is my Blockstack ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    const verificationUrl = "https://www.facebook.com"

    return (
      <div>
        <p>
          1. Fill out your username
        </p>
        <p>
          2. Copy the text below
        </p>
        <p>
          <input value={verificationMessage} className="form-control" readOnly />
        </p>
        <p>
          3. Create a Facebook post with the copied text to publicly verify yourself
        </p>
        <div className="form-group">
          <a href={verificationUrl}>
            <button className="btn btn-outline-primary">
              Create Post
            </button>
          </a>
        </div>
        <p>
          4. Set the post visibility to public, then share it
        </p>
        <p>
          5. Copy the post URL and paste it in the proof URL field
        </p>
      </div>
    )
  }
}

class GithubVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationMessage = "Verifying that \"{{ username }}.id\" is my Blockstack ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    const verificationUrl = 'https://gist.github.com/'

    return (
      <div>
        <p>
          1. Fill out your username
        </p>
        <p>
          2. Copy the text below
        </p>
        <p>
          <input value={verificationMessage} className="form-control" readOnly />
        </p>
        <p>
          3. Create a public gist with the copied text to publicly verify yourself
        </p>
        <div className="form-group">
          <a
            href="#" onClick={(event) => {
              event.preventDefault()
              openInNewTab(verificationUrl)
            }}
          >
            <button className="btn btn-outline-primary">
              Create Gist
            </button>
          </a>
        </div>
        <p>
          4. Copy the gist URL and paste it in the proof URL field
        </p>
      </div>
    )
  }
}

class TwitterVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationUrl = "https://twitter.com/intent/tweet?text=Verifying%20that%20%22{{ username }}.id%22%20is%20my%20Blockstack%20ID.%20https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    return (
      <div>
        <p>
          1. Fill out your username
        </p>
        <p>
          2. Create a tweet to publicly verify yourself
        </p>
        <div className="form-group">
          <a
            href="#" onClick={(event) => {
              event.preventDefault()
              openInNewTab(verificationUrl)
            }}
          >
            <button className="btn btn-outline-primary">
              Create Tweet
            </button>
          </a>
        </div>
        <p>
          3. Copy the tweet URL and paste it in the proof URL field
        </p>
      </div>
    )
  }
}

class VerificationInfo extends Component {
  static contextTypes = {
    service: PropTypes.string,
    domainName: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      services: {
        twitter: true,
        github: true
      }
    }
  }

  render() {
    return (
      <div>
        <div className="card">
          <div className="card-header">
            Verification Instructions
          </div>
          <div className="card-block">
            { this.props.service === 'twitter' ?
              <TwitterVerificationInfo domainName={this.props.domainName} />
            : null }

            { this.props.service === 'github' ?
              <GithubVerificationInfo domainName={this.props.domainName} />
            : null }

            { this.props.service === 'facebook' ?
              <FacebookVerificationInfo domainName={this.props.domainName} />
            : null }

            { !this.state.services.hasOwnProperty(this.props.service) ?
              <p>
                Identity verifications are not yet supported for this account type.
              </p>
            : null }
          </div>
        </div>
      </div>
    )
  }
}

export default VerificationInfo
