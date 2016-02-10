import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import {
  InputGroup, SaveButton, ProfileEditingSidebar, PageHeader
} from '../../components/index'
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
      tabName: "basic info"
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

  changeTabs(tabName) {
    this.setState({tabName: tabName})
  }

  render() {
    return (
      <div className="body-inner body-inner-white">
        <PageHeader title="Edit Profile" subtitle={this.state.tabName} />
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <ProfileEditingSidebar
                activeTab={this.state.tabName}
                onClick={this.changeTabs} />
              <hr />
              <div className="form-group">
                <fieldset>
                  <Link to={this.props.location.pathname.replace('/edit', '')}
                    className="btn btn-outline-primary">
                    View Profile
                  </Link>
                </fieldset>
              </div>
            </div>
            <div className="col-md-9">
              { this.state.profile ? (
              <div>
                {(() => {
                  switch (this.state.tabName) {
                    case "basic info":
                      return (
                        <BasicInfoTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "photos":
                      return (
                        <PhotosTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "social accounts":
                      return (
                        <SocialAccountsTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "private info":
                      return (
                        <PrivateInfoTab
                          profile={this.state.profile}
                          saveProfile={this.saveProfile} />
                      )
                    case "public keys":
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
