import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import SecondaryNavBar from '../components/SecondaryNavBar'
import EditProfileHeader from './components/EditProfileHeader'
import ProfileEditingSidebar from './components/ProfileEditingSidebar'
import { IdentityActions } from './store/identity'
import { signProfileForUpload, findAddressIndex } from '../utils/index'
import { uploadProfile, uploadPhoto } from '../account/utils'

import BasicInfoTab      from './tabs/BasicInfoTab'
import PhotosTab         from './tabs/PhotosTab'
import SocialAccountsTab from './tabs/SocialAccountsTab'
import PublicKeysTab     from './tabs/PublicKeysTab'
import PrivateInfoTab    from './tabs/PrivateInfoTab'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/EditProfilePage.js')

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    api: state.settings.api,
    identityKeypairs: state.account.identityAccount.keypairs,
    identityAddresses: state.account.identityAccount.addresses

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
    identityAddresses: PropTypes.array.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    routeParams: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      domainName: null,
      profile: null,
      profileJustSaved: false,
      verifications: [],
      tabName: ""
    }

    this.saveProfile = this.saveProfile.bind(this)
    this.changeTabs = this.changeTabs.bind(this)
    this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this)
    this.hasUsername = this.hasUsername.bind(this)
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
  }

  componentHasNewLocalIdentities(props) {
    const profileIndex = this.props.routeParams.index
    if (props.localIdentities[profileIndex]) {
      const newDomainName = props.localIdentities[profileIndex].domainName
      const newProfile = props.localIdentities[profileIndex].profile
      if (profileIndex) {
        this.setState({
          domainName: newDomainName,
          profile: newProfile
        })
      }
    } else {
      // Do nothing
    }
  }

  saveProfile(newProfile) {
    logger.trace('saveProfile')
    this.props.updateProfile(this.props.routeParams.index, newProfile)
    if (this.hasUsername() && this.props.api.dropboxAccessToken !== null) {
      logger.trace('saveProfile: Preparing to upload profile')
      const profileIndex = this.props.routeParams.index
      const ownerAddress = this.props.localIdentities[profileIndex].ownerAddress
      const addressIndex = findAddressIndex(ownerAddress, this.props.identityAddresses)
      logger.debug(`saveProfile: signing with key index ${addressIndex}`)
      const data = signProfileForUpload(this.state.profile,
        this.props.identityKeypairs[addressIndex])

      uploadProfile(this.props.api, this.state.domainName, data).catch((err) => {
        console.error(err)
        console.error('profile not uploaded')
      })
    } else {
      logger.trace('saveProfile: No username or storage so we skipped profile upload')
    }
  }


  uploadProfilePhoto(file, index) {
    const name = this.state.domainName
    return uploadPhoto(this.props.api, name, file, index)
  }

  changeTabs(tabName) {
    this.setState({tabName: tabName})
  }

  backClick() {
    this.setState({tabName: ''})
  }

  hasUsername() {
    const localIdentities = this.props.localIdentities
    const currentDomainName = this.state.domainName
    return currentDomainName !== localIdentities[currentDomainName].ownerAddress
  }

  render() {
    const domainName = this.state.domainName
    return (
      <div>
      {this.state.tabName === '' ? (
        <SecondaryNavBar
          leftButtonTitle="Edit"
          leftButtonLink={`/profiles/${domainName}/edit`}
          isLeftActive
          centerButtonTitle="View"
          centerButtonLink="/profiles"
          rightButtonTitle="More"
          rightButtonLink="/profiles/i/all"
        />
        ) : (
        <SecondaryNavBar
          leftButtonTitle="Edit"
          onLeftButtonClick={() => this.backClick()}
          isLeftActive
          centerButtonTitle="View"
          centerButtonLink="/profiles"
          rightButtonTitle="More"
          rightButtonLink="/profiles/i/all"
        />
        )}

        <div>
          {this.state.profile && this.state.domainName ?
          <div className="container-fluid no-padding">
            <div className="row">

              { this.state.tabName === "" ? (
              <div className="col-md-12">
                <ProfileEditingSidebar
                  activeTab={this.state.tabName}
                  onClick={this.changeTabs} />
              </div>
              ) :
              (<div></div>)}

              <div className="col-md-12">
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
                            saveProfile={this.saveProfile}
                            uploadProfilePhoto={this.uploadProfilePhoto} />
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

              { this.state.tabName !== "" ? (
              <div className="col-md-12">
                <div className="form-group">
                  <fieldset>
                    <Link
                      to="/profiles"
                      className="btn btn-primary"
                    >
                      Save + View Profile
                    </Link>
                  </fieldset>
                </div>
              </div>
              ) :
              (<div></div>)}

            </div>
          </div>
          :
          <div>
            <h1 className="h1-modern vertical-split-content">
              Page Not Found
            </h1>
            <p>You don't own this profile and therefore you cannot edit it.</p>
          </div>
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfilePage)
