import React, { Component, PropTypes } from 'react'

import { openInNewTab } from '../../utils'

class FacebookVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    onVerifyButtonClick: PropTypes.func
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationMessage = "Verifying that \"{{ username }}.id\" is my Blockstack ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    const verificationUrl = "https://www.facebook.com"

    return (
      <div>
        <p>
          Post your proof to Facebook. We’ll ask for permission 
          to read your posts, so that we can find this one 
          afterwards. The text can be anything you like, but 
          make sure your post is public. Click the Verify button
          when you’re done.
        </p>
        <button className="btn btn-verify btn-facebook btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-facebook fa-lg" /> CONTINUE WITH FACEBOOK
        </button>
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
          Post your proof to Github. We’ll ask for permission 
          to read your posts, so that we can find this one 
          afterwards. The text can be anything you like, but 
          make sure your post is public. Click the Verify button
          when you’re done.
        </p>
        <button className="btn btn-verify btn-github btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-github fa-lg" /> CREATE GIST
        </button>
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
          Post your proof to Twitter. We’ll ask for permission 
          to read your posts, so that we can find this one 
          afterwards. The text can be anything you like, but 
          make sure your post is public. Click the Verify button
          when you’re done.
        </p>
        <button className="btn btn-verify btn-twitter btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-twitter fa-lg" /> TWEET VERIFICATION
        </button>
      </div>
    )
  }
}

/*          <a
            href="#" onClick={(event) => {
              event.preventDefault()
              openInNewTab(verificationUrl)
            }}
          >*/

class VerificationInfo extends Component {
  static contextTypes = {
    service: PropTypes.string,
    domainName: PropTypes.string,
    onVerifyButtonClick: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      services: {
        facebook: true,
        twitter: true,
        github: true
      }
    }
  }

  handleClick(e) {
    e.stopPropagation()
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <div className="verification-instructions-container">
          <p className="verification-instructions-heading">
            Verification Instructions
          </p>
          <div className="verification-instructions">
            { this.props.service === 'twitter' ?
              <TwitterVerificationInfo domainName={this.props.domainName} 
                onVerifyButtonClick={this.props.onVerifyButtonClick}/>
            : null }

            { this.props.service === 'github' ?
              <GithubVerificationInfo domainName={this.props.domainName} 
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
            : null }

            { this.props.service === 'facebook' ?
              <FacebookVerificationInfo domainName={this.props.domainName} 
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
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
