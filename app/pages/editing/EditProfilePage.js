import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Person, flattenObject, unflattenObject } from 'blockchain-profile'

import { InputGroup, SaveButton, ProfileEditingSidebar } from '../../components/index'
import { IdentityActions } from '../../store/identities'
import { getNameParts } from '../../utils/profile-utils'

import BasicInfoTab from './BasicInfoTab'
import PhotosTab from './PhotosTab'
import SocialAccountsTab from './SocialAccountsTab'
import PublicKeysTab from './PublicKeysTab'
import PrivateInfoTab from './PrivateInfoTab'

function mapStateToProps(state) {
  return {
    localIdentities: state.identities.local
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(IdentityActions, dispatch)
}

class EditProfilePage extends Component {
  static propTypes = {
    updateProfile: PropTypes.func.isRequired,
    localIdentities: PropTypes.array.isRequired
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
    this.changeTabs = this.changeTabs.bind(this)
  }

  componentHasNewLocalIdentities(props) {
    const profileIndex = this.props.routeParams.index
    if (profileIndex) {
      this.setState({
        id: props.localIdentities[profileIndex].id,
        profile: props.localIdentities[profileIndex].profile
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

  saveProfile(newProfile) {
    this.props.updateProfile(this.props.routeParams.index, newProfile)
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
          <Link to={this.props.location.pathname.replace('/edit', '')}
            className="btn btn-secondary">
            View Profile
          </Link>
          <hr />
          <div className="row">
            <div className="col-md-3">
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
