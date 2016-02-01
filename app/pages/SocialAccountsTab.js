import React, { Component, PropTypes } from 'react'

import InputGroup from '../components/InputGroup'
import SaveButton from '../components/SaveButton'

class SocialAccountsTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { profile: this.props.profile }
    this.onChange = this.onChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
    this.createItem = this.createItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profile !== this.props.profile) {
      this.setState({profile: nextProps.profile})
    }
  }

  saveProfile() {
    this.props.saveProfile(this.state.profile)
  }

  deleteItem(itemIndex) {
    let profile = this.state.profile
    let newProfile = Object.assign({}, profile, {
      account: [
        ...profile.account.slice(0, itemIndex),
        ...profile.account.slice(itemIndex + 1)
      ]
    })
    this.setState({profile: newProfile})
    this.props.saveProfile(newProfile)
  }

  createItem() {
    let profile = this.state.profile
    if (!profile.hasOwnProperty('account')) {
      profile.account = []
    }
    profile.account.push({
      '@type': 'Account',
      'service': '',
      'identifier': '',
      'proofType': 'http',
      'proofUrl': ''
    })
    this.setState({profile: profile})
    this.props.saveProfile(profile)
  }

  onChange(index, event) {
    let profile = this.state.profile
    profile.account[index][event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  render() {
    const profile = this.state.profile,
          accounts = this.state.profile.hasOwnProperty('account') ?
            this.state.profile.account : []
    return (
      <div>
        <h4>Social Accounts</h4>
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.createItem}>
            Create Account
          </button>
        </div>
        { accounts.map((account, index) => {
          return (
            <div key={index}>
              { account.proofType === 'http' ?
              <div>
                <InputGroup
                  name="service" label="Site Name"
                  data={profile.account[index]}
                  onChange={(event) => { this.onChange(index, event) }} />
                <InputGroup
                  name="identifier" label="Username"
                  data={profile.account[index]}
                  onChange={(event) => { this.onChange(index, event) }} />
                <InputGroup
                  name="proofUrl" label="Proof URL"
                  data={profile.account[index]}
                  onChange={(event) => { this.onChange(index, event) }} />
                <div className="form-group">
                  <button className="btn btn-primary"
                    onClick={() => {this.deleteItem(index)}}>
                    Delete
                  </button>
                </div>
              </div>
              : null }
            </div>
          )
        }) }
      </div>
    )
  }
}

export default SocialAccountsTab