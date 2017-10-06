import React, { Component, PropTypes } from 'react'

import InputGroup from '../../components/InputGroup'
import { openInNewTab } from '../../utils'

class TwitterVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationUrl = "https://twitter.com/intent/tweet?text=Verifying%20that%20%22{{ username }}.id%22%20is%20my%20Blockstack%20ID.%20https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    return (
      <div>
        <p>
          1. Copy the text below and click the Tweet Verification button post your proof to Twitter. 
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <p>
          2. Copy the tweet URL and paste it into the proof URL field. 
        </p>
        <button className="btn btn-verify btn-twitter btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-twitter fa-lg" /> Tweet Verification
        </button>
      </div>
    )
  }
}

class FacebookVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string,
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
          1. Post the following text to your Facebook timeline. Make sure your post is public!
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <p>
          2. Copy the post URL and paste it into the proof URL field. 
        </p>
        <button className="btn btn-verify btn-facebook btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-facebook fa-lg" /> Continue with Facebook
        </button>
      </div>
    )
  }
}

class GithubVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string
  }

  render() {
    const username = this.props.domainName.split('.')[0]

    const verificationMessage = "Verifying that \"{{ username }}.id\" is my Blockstack ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), username)
    const verificationUrl = 'https://gist.github.com/'

    return (
      <div>
        <p>
          1. Create a public gist with the following text.
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <p>
          2. Copy the gist URL and paste it into the proof URL field.
        </p>
        <button className="btn btn-verify btn-github btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-github fa-lg" /> Create Gist
        </button>
      </div>
    )
  }
}

class LinkedInVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string
  }

  render() {
    const verificationUrl = ""

    return (
      <div>
        <p>
          1. Post the following text on your LinkedIn. Make sure your post is public!
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <p>
          2. Copy the post URL and paste it into the proof URL field. 
        </p>
        <button className="btn btn-verify btn-linkedin btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-linkedin fa-lg" /> Post Verification to LinkedIn
        </button>
      </div>
    )
  }
}

class InstagramVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string
  }

  render() {
    const verificationUrl = ""

    return (
      <div>
        <p>
          1. Post a photo to instagram with the following caption.
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <p>
          2. Copy the post URL and paste it into the proof URL field.
        </p>
      </div>
    )
  }
}

class HackerNewsVerificationInfo extends Component {
  static contextTypes = {
    domainName: PropTypes.string,
    ownerAddress: PropTypes.string
  }

  render() {
    return (
      <div>
        <p>
          1. Copy the text below and add it to the about section in your Hacker News user profile. 
        </p>
        <div className="verification-quote">
          Verifying my Blockstack ID is secured with the address {this.props.ownerAddress}
        </div>
        <button className="btn btn-verify btn-twitter btn-block" onClick={this.props.onVerifyButtonClick}>
          <i className="fa fa-fw fa-hacker-news fa-lg" /> Verify Hacker News Account
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
    ownerAddress: PropTypes.string,
    onVerifyButtonClick: PropTypes.func,
    proofURL: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.state = {
      services: {
        facebook: true,
        twitter: true,
        github: true,
        linkedin: true,
        instagram: true,
        hackernews: true,
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
              <TwitterVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
                onVerifyButtonClick={this.props.onVerifyButtonClick}/>
            : null }

            { this.props.service === 'github' ?
              <GithubVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
            : null }

            { this.props.service === 'facebook' ?
              <FacebookVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
            : null }

            { this.props.service === 'linkedin' ?
              <LinkedInVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
            : null }

            { this.props.service === 'instagram' ?
              <InstagramVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
                onVerifyButtonClick={this.props.onVerifyButtonClick} />
            : null }

            { this.props.service === 'hackernews' ?
              <HackerNewsVerificationInfo 
                domainName={this.props.domainName} 
                ownerAddress={this.props.ownerAddress}
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
