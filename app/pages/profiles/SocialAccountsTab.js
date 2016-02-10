import React, { Component, PropTypes } from 'react'

import { InputGroup, SaveButton } from '../../components/index'

class SocialAccountsTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: this.props.profile,
      newAccountType: null,
      accountServiceNames: {
        'twitter': 'Twitter',
        'facebook': 'Facebook',
        'instagram': 'Instagram',
        'linkedin': 'LinkedIn',
        'reddit': 'Reddit',
        'youtube': 'YouTube',
        'tumblr': 'Tumblr',
        'pinterest': 'Pinterest',
        'github': 'GitHub',
        'google-plus':'Google+',
        'angellist': 'AngelList',
        'stack-overflow': 'StackOverflow',
        'hacker-news': 'Hacker News'
      }
    }
    this.onChange = this.onChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
    this.createItem = this.createItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.updateNewAccountType = this.updateNewAccountType.bind(this)
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

  createItem(service) {
    if (this.state.newAccountType) {
      let profile = this.state.profile
      if (!profile.hasOwnProperty('account')) {
        profile.account = []
      }
      profile.account.push({
        '@type': 'Account',
        'service': this.state.newAccountType,
        'identifier': '',
        'proofType': 'http',
        'proofUrl': ''
      })
      this.setState({profile: profile})
      this.props.saveProfile(profile)
    }
  }

  onChange(index, event) {
    let profile = this.state.profile
    profile.account[index][event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  updateNewAccountType(event) {
    this.setState({
      newAccountType: event.target.value
    })
  }

  render() {
    const profile = this.state.profile,
          accounts = this.state.profile.hasOwnProperty('account') ?
            this.state.profile.account : []
    return (
      <div>
        <h4>Social Accounts</h4>

        <div className="form-group">
          <select name="newAccountType" className="custom-select" defaultValue="none"
            onChange={this.updateNewAccountType}>
            <option value="none">Account type</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="github">GitHub</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">Linkedin</option>
            <option value="tumblr">Tumblr</option>
            <option value="reddit">Reddit</option>
            <option value="pinterest">Pinterest</option>
            <option value="youtube">YouTube</option>
            <option value="google-plus">Google+</option>
            <option value="angellist">AngelList</option>
            <option value="stack-overflow">StackOverflow</option>
            <option value="hacker-news">Hacker News</option>
          </select>
        </div>
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.createItem}>
            Add Account
          </button>
        </div>

        { accounts.map((account, index) => {
          let accountServiceName = this.state.accountServiceNames[account.service]
          return (
            <div key={index}>
              { account.proofType === 'http' ?
              <div>
                <div hidden>
                  <InputGroup
                    name="service" label="Site Name"
                    data={account}
                    onChange={(event) => { this.onChange(index, event) }} />
                </div>
                <InputGroup
                  name="identifier" label={accountServiceName + " Username"}
                  data={account}
                  onChange={(event) => { this.onChange(index, event) }} />
                { ['twitter', 'facebook', 'github'].indexOf(account.service) > -1 ?
                <InputGroup
                  name="proofUrl" label={accountServiceName + " Proof URL"}
                  data={account}
                  onChange={(event) => { this.onChange(index, event) }} />
                : null }
                <div className="form-group">
                  <button className="btn btn-outline-primary"
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
