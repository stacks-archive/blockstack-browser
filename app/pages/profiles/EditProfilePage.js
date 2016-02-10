import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import { InputGroup, SaveButton, ProfileEditingSidebar } from '../../components/index'
import { IdentityActions } from '../../store/identities'
import { getNameParts, uploadObject } from '../../utils/index'

import BasicInfoTab from './BasicInfoTab'
import PhotosTab from './PhotosTab'
import SocialAccountsTab from './SocialAccountsTab'
import PublicKeysTab from './PublicKeysTab'
import PrivateInfoTab from './PrivateInfoTab'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.local,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditProfilePage extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    localIdentities: PropTypes.array.isRequired,
    api: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      id: null,
      profile: null,
      profileJustSaved: false,
      verifications: [],
      tabIndex: 0
    }

    this.saveProfile = this.saveProfile.bind(this)
    this.uploadProfile = this.uploadProfile.bind(this)
    this.changeTabs = this.changeTabs.bind(this)
  }

  componentHasNewLocalIdentities(props) {
    const profileIndex = this.props.routeParams.index,
          newId = props.localIdentities[profileIndex].id,
          newProfile = props.localIdentities[profileIndex].profile
    if (profileIndex) {
      this.setState({
        id: newId,
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
    const credentials = {
      key: this.props.api.s3ApiKey,
      secret: this.props.api.s3ApiSecret,
      bucket: this.props.api.s3Bucket
    }
    const filename = this.state.id,
          data = JSON.stringify(this.state.profile, null, 2)
    uploadObject(credentials, filename, data, ({ url, err }) => {
      if (!err) {
        console.log('profile uploaded to s3')
      }
    })
  }

  changeTabs(tabIndex) {
    this.setState({tabIndex: tabIndex})
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <div className="container">
            <h1>Edit Profile</h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <Link to={this.props.location.pathname.replace('/edit', '')}
                className="btn btn-secondary">
                View Profile
              </Link>
              <hr />
              <ProfileEditingSidebar onClick={this.changeTabs} />
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
                          saveProfile={this.saveProfile} />
                      )
                    case 1:
                      return (
                        <PhotosTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case 2:
                      return (
                        <SocialAccountsTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case 3:
                      return (
                        <PrivateInfoTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case 4:
                      return (
                        <PublicKeysTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile}
                          blockchainId={this.state.id} />
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
