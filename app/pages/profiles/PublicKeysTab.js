import React, { Component, PropTypes } from 'react'

import { InputGroup, SaveButton } from '../../components/index'

class PublicKeysTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired,
    blockchainId: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: null
    }
    this.onChange = this.onChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
    this.createItem = this.createItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  componentWillMount() {
    this.setState({profile: this.props.profile})
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
    let profile = this.state.profile
    if (!profile.hasOwnProperty('account')) {
      profile.account = []
    }
    profile.account.push({
      '@type': 'Account',
      'service': service,
      'identifier': '',
      'proofType': 'signature',
      'proofMessage': `Verifying that ${this.props.blockchainId} is my blockchain ID.`,
      'proofSignature': ''
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
        <div className="form-group">
          <button className="btn btn-primary"
            onClick={() => {this.createItem('bitcoin')}}>
            Add Bitcoin Address
          </button>
          &nbsp;
          <button className="btn btn-primary"
            onClick={() => {this.createItem('pgp')}}>
            Add PGP Key
          </button>
        </div>
        { accounts.map((account, index) => {
          return (
            <div key={index}>
              { account.proofType === 'signature' ?
              <div>
                <div hidden>
                  <InputGroup
                    name="service" label="Key Type"
                    data={profile.account[index]}
                    onChange={(event) => {this.onChange(index, event)}} />
                </div>
                { account.service === 'bitcoin' ?
                <InputGroup
                  name="identifier" label="Bitcoin Address"
                  data={profile.account[index]}
                  onChange={(event) => {this.onChange(index, event)}} />
                : null }
                { account.service === 'pgp' ?
                <InputGroup
                  name="identifier" label="PGP Public Key"
                  data={profile.account[index]}
                  onChange={(event) => {this.onChange(index, event)}} />
                : null }
                <InputGroup
                  name="proofMessage" label="Proof Message"
                  data={profile.account[index]}
                  onChange={(event) => {this.onChange(index, event)}} />
                <InputGroup
                  name="proofSignature" label="Proof Signature"
                  data={profile.account[index]}
                  onChange={(event) => {this.onChange(index, event)}} />
                <div className="form-group">
                  <button className="btn btn-outline-primary"
                    onClick={(event) => {this.deleteItem(index)}}>
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

export default PublicKeysTab