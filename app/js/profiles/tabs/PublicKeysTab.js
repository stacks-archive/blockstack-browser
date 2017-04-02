import React, { Component, PropTypes } from 'react'

import InputGroup from '../../components/InputGroup'
import SaveButton from '../../components/SaveButton'

class PublicKeysTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired,
    domainName: PropTypes.string.isRequired
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
      'proofMessage': `Verifying that ${this.props.domainName} is my blockchain ID.`,
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
          <p>
          <button className="btn btn-primary"
            onClick={() => {this.createItem('bitcoin')}}>
            Add Bitcoin Address
          </button>
          </p>
          <p>
          <button className="btn btn-primary"
            onClick={() => {this.createItem('ethereum')}}>
            Add Ethereum Address
          </button>
          </p>
          <p>
            <button className="btn btn-primary"
              onClick={() => {this.createItem('pgp')}}>
              Add PGP Key
            </button>
          </p>
          <p>
            <button className="btn btn-primary"
              onClick={() => {this.createItem('ssh')}}>
              Add SSH Key
            </button>
          </p>
        </div>
        { accounts.map((account, index) => {
          return (
            <div key={index}>
              { account.proofType === 'signature' ?
              <div className="card">
                <div className="card-header">
                  {account.service}
                  <div hidden>
                    <InputGroup
                      name="service" label="Key Type"
                      data={profile.account[index]}
                      onChange={(event) => {this.onChange(index, event)}} />
                  </div>
                </div>
                <div className="card-block">
                  { account.service === 'bitcoin' ?
                  <InputGroup
                    name="identifier" label="Bitcoin Address"
                    data={profile.account[index]}
                    onChange={(event) => {this.onChange(index, event)}} />
                  : null }
                  { account.service === 'ethereum' ?
                  <InputGroup
                    name="identifier" label="Ethereum Address"
                    data={profile.account[index]}
                    onChange={(event) => {this.onChange(index, event)}} />
                  : null }
                  { account.service === 'pgp' ?
                  <span>
                    <InputGroup
                      name="identifier" label="PGP Fingerprint"
                      data={profile.account[index]}
                      onChange={(event) => {this.onChange(index, event)}} />
                    <InputGroup
                      name="publicKey" label="PGP Public Key"
                      data={profile.account[index]}
                      onChange={(event) => {this.onChange(index, event)}}
                      textarea={true} textareaRows={5} />
                  </span>
                  : null }
                  { account.service === 'ssh' ?
                  <span>
                    <InputGroup
                      name="identifier" label="SSH Fingerprint"
                      data={profile.account[index]}
                      onChange={(event) => {this.onChange(index, event)}} />
                    <InputGroup
                      name="publicKey" label="SSH Public Key"
                      data={profile.account[index]}
                      onChange={(event) => {this.onChange(index, event)}}
                      textarea={true} textareaRows={5} />
                  </span>
                  : null }
                  <InputGroup
                    name="proofSignature" label="Proof Signature"
                    data={profile.account[index]}
                    onChange={(event) => {this.onChange(index, event)}} />
                  <InputGroup
                    name="proofMessage" label="Proof Message"
                    data={profile.account[index]}
                    onChange={(event) => {this.onChange(index, event)}} />
                  <div className="form-group">
                    <button className="btn btn-outline-primary"
                      onClick={(event) => {this.deleteItem(index)}}>
                      Delete
                    </button>
                  </div>
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
