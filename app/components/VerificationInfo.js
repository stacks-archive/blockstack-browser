import React, { Component, PropTypes } from 'react'
import { shell } from 'electron'

class FacebookVerificationInfo extends Component {
  static contextTypes = {
    username: React.PropTypes.string
  }

  render() {
    const verificationMessage = "Verifying that +{{ username }} is my blockchain ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), this.props.username)
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
          <a href="#" onClick={(event) => {
            event.preventDefault()
            shell.openExternal(verificationUrl)
          }}>
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
    username: React.PropTypes.string
  }

  render() {
    const verificationMessage = "Verifying that +{{ username }} is my blockchain ID. https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), this.props.username)
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
          3. Create a Gist with the copied text to publicly verify yourself
        </p>
        <div className="form-group">
          <a href="#" onClick={(event) => {
            event.preventDefault()
            shell.openExternal(verificationUrl)
          }}>
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
    username: React.PropTypes.string
  }

  render() {
    const verificationUrl = "https://twitter.com/intent/tweet?text=Verifying%20that%20%2B{{ username }}%20is%20my%20blockchain%20ID.%20https://onename.com/{{ username }}"
      .replace(new RegExp('{{ username }}', 'g'), this.props.username)
    return (
      <div>
        <p>
          1. Fill out your username
        </p>
        <p>
          2. Create a tweet to publicly verify yourself
        </p>
        <div className="form-group">
          <a href="#" onClick={(event) => {
            event.preventDefault()
            shell.openExternal(verificationUrl)
          }}>
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
    service: React.PropTypes.string,
    identifier: React.PropTypes.string
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
              <TwitterVerificationInfo username={this.props.identifier} />
            : null }

            { this.props.service === 'github' ? 
              <GithubVerificationInfo username={this.props.identifier} />
            : null }

            { this.props.service === 'facebook' ? 
              <FacebookVerificationInfo username={this.props.identifier} />
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