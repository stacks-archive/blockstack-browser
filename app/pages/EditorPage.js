import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person, flattenObject, unflattenObject } from 'blockchain-profile'

import InputGroup from '../components/InputGroup'
import { SaveButton } from '../components/Buttons'
import * as IdentityActions from '../actions/identities'
import { getNameParts } from '../utils/profile-utils'

function mapStateToProps(state) {
  return {
    currentIdentity: state.identities.current,
    localIdentities: state.identities.local,
    registeredIdentities: state.identities.registered
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditorPage extends Component {
  static propTypes = {
    fetchCurrentIdentity: PropTypes.func.isRequired,
    updateProfile: PropTypes.func.isRequired,
    currentIdentity: PropTypes.object.isRequired,
    localIdentities: PropTypes.array.isRequired,
    registeredIdentities: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      profile: null,
      flatProfile: null,
      profileJustSaved: false,
      verifications: []
    }

    this.onValueChange = this.onValueChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
  }

  componentWillMount() {
    const routeParams = this.props.routeParams
    if (routeParams.index) {
      const localIdentities = this.props.localIdentities.concat(this.props.registeredIdentities)
      const profile = localIdentities[routeParams.index].profile,
            verifications = []
      this.props.updateCurrentIdentity(profile, verifications)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentIdentity !== this.props.currentIdentity) {
      var profile = nextProps.currentIdentity.profile,
          flatProfile = flattenObject(profile)
      flatProfile.givenName, flatProfile.familyName = getNameParts(profile)
      this.setState({
        profile: profile,
        flatProfile: flatProfile
      })
    }
  }

  saveProfile() {
    this.props.updateProfile(this.props.routeParams.index, this.state.profile)
  }

  onValueChange(event) {
    var flatProfile = this.state.flatProfile
    flatProfile[event.target.name] = event.target.value
    if (event.target.name === "image[0].contentUrl") {
      flatProfile["image[0].name"] = "avatar"
    }
    this.setState({
      flatProfile: flatProfile,
      profile: unflattenObject(flatProfile)
    })
  }

  render() {
    var flatProfile = this.state.flatProfile,
        profile = this.state.profile,
        _this = this

    return (
      <div>
          { flatProfile && profile ? (
          <div>
              <h1>Edit Profile</h1>

              <hr />
              <h3>Basic Information</h3>
              <InputGroup name="givenName" label="First Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="familyName" label="Last Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="description" label="Short Bio"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="image[0].contentUrl" label="Profile Image URL"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="website[0].url" label="Website"
                  data={flatProfile} onChange={this.onValueChange} />
              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>

              <hr />

              <h3>Accounts</h3>
              {
                profile.account ?
                profile.account.map(function(account, index) {
                  var identifierLabel = 'Identifier'
                  if (account.service === 'bitcoin') {
                    identifierLabel = 'Address'
                  }
                  if (['twitter', 'facebook', 'github'].indexOf(account.service) > -1) {
                    identifierLabel = 'Username'
                  }

                  return (
                    <div key={index}>
                      { account.proofType === 'http' ?
                        <div>
                        <InputGroup
                          name={"account[" + index + "].identifier"}
                          label={account.service + " " + identifierLabel}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        <InputGroup
                          name={"account[" + index + "].proofUrl"}
                          label={account.service + " Proof URL"}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        </div>
                      : null }
                      { account.service.toLowerCase() === 'bitcoin' || account.proofType === 'signature' ?
                        <div>
                        <InputGroup
                          name={"account[" + index + "].identifier"}
                          label={account.service + " " + identifierLabel}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        <InputGroup
                          name={"account[" + index + "].proofSignature"}
                          label={account.service + " Signature"}
                          data={flatProfile}
                          onChange={_this.onValueChange} />
                        </div>
                      : null }
                    </div>
                  )
                })
                : null
              }

              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>
          </div>
          ) : null }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorPage)
