import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Person, flattenObject, unflattenObject } from 'blockchain-profile'

import InputGroup from '../components/InputGroup'
import SaveButton from '../components/SaveButton'
import ProfileEditingSidebar from '../components/ProfileEditingSidebar'
import { IdentityActions } from '../store/identities'
import { getNameParts } from '../utils/profile-utils'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class BasicInfoTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {profile: this.props.profile}
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onSave() {
    this.props.onSave(this.state.profile)
  }

  onChange(event) {
    let profile = this.state.profile
    profile[event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  render() {
    return (
      <div>
        <h4>Basic Info</h4>
        <InputGroup name="givenName" label="First Name"
            data={this.props.profile} onChange={this.onChange} />
        <InputGroup name="familyName" label="Last Name"
            data={this.props.profile} onChange={this.onChange} />
        <InputGroup name="description" label="Short Bio"
            data={this.props.profile} onChange={this.onChange} />
        <div className="form-group">
            <SaveButton onSave={this.onSave} />
        </div>
      </div>
    )
  }
}

class PhotosTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {profile: this.props.profile}
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onSave() {
    this.props.onSave(this.state.profile)
  }

  onChange(event) {
    let profile = this.state.profile
    profile[event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  render() {
    return (
      <div>
        <h4>Photos</h4>
        <div className="form-group">
            <SaveButton onSave={this.onSave} />
        </div>
      </div>
    )
  }
}

class SocialAccountsTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: this.props.profile
    }
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.createNewAccount = this.createNewAccount.bind(this)
    this.deleteAccount = this.deleteAccount.bind(this)
  }

  onSave() {
    this.props.onSave(this.state.profile)
  }

  deleteAccount(accountIndex) {
    let profile = this.state.profile
    let newProfile = Object.assign({}, profile, {
      account: [
        ...profile.account.slice(0, accountIndex),
        ...profile.account.slice(accountIndex + 1)
      ]
    })
    this.setState({profile: newProfile})
  }

  createNewAccount() {
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
          <button className="btn btn-primary" onClick={this.createNewAccount}>
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
                  data={profile.account[index]} onChange={(event) => {
                    this.onChange(index, event)
                  }} />
                <InputGroup
                  name="identifier" label="Username"
                  data={profile.account[index]} onChange={(event) => {
                    this.onChange(index, event)
                  }} />
                <InputGroup
                  name="proofUrl" label="Proof URL"
                  data={profile.account[index]} onChange={(event) => {
                    this.onChange(index, event)
                  }} />
                <div className="form-group">
                  <button className="btn btn-primary"
                    onClick={() => {
                      console.log(index)
                      this.deleteAccount(index)
                    }}>
                    Delete Account
                  </button>
                </div>
              </div>
              : null }
            </div>
          )
        }) }
        <div className="form-group">
          <SaveButton onSave={this.saveProfile} />
        </div>
      </div>
    )
  }
}

class EditProfilePage extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired,
    localIdentities: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      profile: null,
      profileJustSaved: false,
      verifications: [],
      tabIndex: 0
    }

    this.onBasicInfoSave = this.onBasicInfoSave.bind(this)
    this.onSidebarItemClick = this.onSidebarItemClick.bind(this)
  }

  componentWillMount() {
    const routeParams = this.props.routeParams
    if (routeParams.index) {
      const profile = this.props.localIdentities[routeParams.index].profile,
            id = this.props.localIdentities[routeParams.index].id,
            verifications = []
      this.props.updateCurrentIdentity(id, profile, verifications)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIdentity !== this.props.currentIdentity) {
      this.setState({profile: nextProps.currentIdentity.profile})
    }
  }

  onBasicInfoSave(profileUpdate) {
    let newProfile = Object.assign({}, this.state.profile, profileUpdate)
    this.props.updateProfile(this.props.routeParams.index, newProfile)
  }

  onSidebarItemClick(tabIndex) {
    this.setState({tabIndex: tabIndex})
  }

  render() {
    return (
      <div>
          <h2>Edit Profile</h2>
          <hr />
          <div className="row">
            <div className="col-md-3">
              <ProfileEditingSidebar onClick={this.onSidebarItemClick} />
            </div>
            <div className="col-md-9">
              { this.state.profile ? (
              <div>
                {(() => {
                  switch (this.state.tabIndex) {
                    case 0:
                      return (
                        <BasicInfoTab
                          profile={this.state.profile}
                          onSave={this.onBasicInfoSave} />
                      )
                    case 1:
                      return (
                        <PhotosTab
                          profile={this.state.profile}
                          onSave={this.onBasicInfoSave} />
                      )
                    case 2:
                      return (
                        <SocialAccountsTab
                          profile={this.state.profile}
                          onSave={this.onBasicInfoSave} />
                      )
                    default:
                      return (
                        <div></div>
                      )
                  }
                })()}
              </div>
              ) : null }
            </div>
          </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
