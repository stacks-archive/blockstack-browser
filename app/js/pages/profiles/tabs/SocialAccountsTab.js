import React, { Component, PropTypes } from 'react'

import {
  InputGroup, SaveButton, VerificationInfo
} from '../../../components/index'

import { webAccountTypes } from '../../../utils'

class SocialAccountsTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired,
    domainName: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: this.props.profile,
      newAccountType: null,
      instructionSectionsShown: {
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

  showVerificationInstructions(index) {
    let instructionSectionsShown = this.state.instructionSectionsShown
    instructionSectionsShown[String(index)] = true
    this.setState({
      instructionSectionsShown: instructionSectionsShown
    })
  }

  render() {
    const profile = this.state.profile,
          accounts = this.state.profile.hasOwnProperty('account') ?
            this.state.profile.account : []
    return (
      <div>
        <div className="form-group">
          <select name="newAccountType" className="custom-select" defaultValue="none"
            onChange={this.updateNewAccountType}>
            <option value="none">Account type</option>
            { Object.keys(webAccountTypes).map((webAccountID) => {
              let webAccountType = webAccountTypes[webAccountID]
              if (webAccountType !== undefined && webAccountType.social) {
                return (
                  <option key={webAccountID} value={webAccountID}>
                    {webAccountType.label}
                  </option>
                )
              }
            })}
          </select>
        </div>
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.createItem}>
            Add Account
          </button>
        </div>

        { accounts.map((account, index) => {
          let webAccountType = webAccountTypes[account.service]
          if (webAccountType) {
            let accountServiceName = webAccountType.label
            return (
              <div key={index}>
                { account.proofType === 'http' ?
                <div className="card">
                  <div className="card-header">
                    {accountServiceName}
                    <div hidden>
                      <InputGroup
                        name="service" label="Site Name"
                        data={account}
                        onChange={(event) => { this.onChange(index, event) }} />
                    </div>
                  </div>
                  <div className="card-block">
                    { ['openbazaar'].indexOf(account.service) < 0 ?
                    <InputGroup
                      name="identifier" label={"Username"}
                      data={account}
                      onChange={(event) => { this.onChange(index, event) }} />
                    : null }

                    { ['openbazaar'].indexOf(account.service) > -1 ?
                    <InputGroup
                      name="identifier" label={"GUID"}
                      data={account}
                      onChange={(event) => { this.onChange(index, event) }} />
                    : null }
                    
                    { ['twitter', 'facebook', 'github'].indexOf(account.service) > -1 ?
                    <div>
                      <InputGroup
                        name="proofUrl" label={"Proof URL"}
                        data={account}
                        onChange={(event) => { this.onChange(index, event) }} />

                      { this.state.instructionSectionsShown.hasOwnProperty(String(index)) ?
                        <VerificationInfo
                          service={account.service}
                          domainName={this.props.domainName} />
                      :
                      <div className="form-group">
                        <button className="btn btn-outline-primary"
                          onClick={() => {this.showVerificationInstructions(index)}}>
                          Verification Instructions
                        </button>
                      </div>
                      }
                    </div>
                    : null }

                    <div className="form-group">
                      <button className="btn btn-outline-primary"
                        onClick={() => {this.deleteItem(index)}}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                : null }
              </div>
            )
          }
        }) }
      </div>
    )
  }
}

export default SocialAccountsTab
