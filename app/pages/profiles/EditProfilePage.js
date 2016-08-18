import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { signToken, wrapToken } from 'blockstack-profiles'
import { PrivateKeychain, PublicKeychain } from 'blockstack-keychains'

import {
  InputGroup, SaveButton, ProfileEditingSidebar, PageHeader
} from '../../components/index'
import { IdentityActions } from '../../store/identities'
import { getNameParts, uploadFile } from '../../utils/index'

import BasicInfoTab from './BasicInfoTab'
import PhotosTab from './PhotosTab'
import SocialAccountsTab from './SocialAccountsTab'
import PublicKeysTab from './PublicKeysTab'
import PrivateInfoTab from './PrivateInfoTab'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.localIdentities,
    api: state.settings.api,
    identityKeypairs: state.account.identityAccount.keypairs
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditProfilePage extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    localIdentities: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    identityKeypairs: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      domainName: null,
      profile: null,
      profileJustSaved: false,
      verifications: [],
      tabName: "Basic Info"
    }

    this.saveProfile = this.saveProfile.bind(this)
    this.uploadProfile = this.uploadProfile.bind(this)
    this.changeTabs = this.changeTabs.bind(this)
  }

  componentHasNewLocalIdentities(props) {
    const profileIndex = this.props.routeParams.index,
          newDomainName = props.localIdentities[profileIndex].domainName,
          newProfile = props.localIdentities[profileIndex].profile
    if (profileIndex) {
      this.setState({
        domainName: newDomainName,
        profile: newProfile
      })
    }
  }

  componentWillMount() {
    this.componentHasNewLocalIdentities(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.localIdentities !== this.props.localIdentities) {
      this.componentHasNewLocalIdentities(nextProps)
    }
  }

  componentWillUnmount() {
    this.saveProfile(this.state.profile)
    this.uploadProfile()
  }

  saveProfile(newProfile) {
    this.props.updateProfile(this.props.routeParams.index, newProfile)
  }

  uploadProfile() {
    const filename = this.state.domainName + '.json'

    const keypair = this.props.identityKeypairs[0],
          privateKey = keypair.key,
          publicKey = keypair.keyID

    const token = signToken(this.state.profile, privateKey, {publicKey: publicKey}),
          tokenRecord = wrapToken(token),
          tokenRecords = [tokenRecord]
    const data = JSON.stringify(tokenRecords, null, 2)
    uploadFile(this.props.api, filename, data, ({ url, err, res }) => {
      if (err) {
        console.log(res)
        console.log('profile not uploaded to s3')
      }
    })
  }

  changeTabs(tabName) {
    this.setState({tabName: tabName})
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Edit Profile" subtitle={this.state.tabName} />
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <ProfileEditingSidebar
                activeTab={this.state.tabName}
                onClick={this.changeTabs} />
              <hr />
              <div className="form-group">
                <fieldset>
                  <Link to={this.props.location.pathname.replace('/edit', '')}
                    className="btn btn-primary">
                    Save + View Profile
                  </Link>
                </fieldset>
              </div>
            </div>
            <div className="col-md-8">
              { this.state.profile ? (
              <div>
                {(() => {
                  switch (this.state.tabName) {
                    case "Basic Info":
                      return (
                        <BasicInfoTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "Photos":
                      return (
                        <PhotosTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "Social Accounts":
                      return (
                        <SocialAccountsTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile}
                          domainName={this.state.domainName} />
                      )
                    case "Address":
                      return (
                        <PrivateInfoTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "Digital Keys":
                      return (
                        <PublicKeysTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile}
                          domainName={this.state.domainName} />
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
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
