import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { CameraIcon, CloudUploadIcon } from 'mdi-react'
import { IdentityActions } from '../store/identity'
import log4js from 'log4js'
import { uploadPhoto } from '../../account/utils'

const logger = log4js.getLogger('profiles/components/PhotoModal.js')

class PhotoModal extends React.PureComponent {
  onChangePhotoClick = () => {
    this.photoUpload.click()
  }

  uploadProfilePhoto = ev => {
    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]
    const identitySigner = this.props.identityKeypairs[identityIndex]
    const photoIndex = 0

    logger.debug('uploadProfilePhoto: trying to upload...')
    if (this.props.storageConnected) {
      uploadPhoto(
        this.props.api,
        identity,
        identitySigner,
        ev.target.files[0],
        photoIndex
      )
        .then(avatarUrl => {
          logger.debug(`uploadProfilePhoto: uploaded photo: ${avatarUrl}`)
          this.props.onUpload(avatarUrl)
          this.props.refreshIdentities(
            this.props.api,
            this.props.identityAddresses
          )
        })
        .catch(error => {
          logger.error(`uploadProfilePhoto: upload failed with error: ${error.message}`)
        })
    } else {
      logger.error(
        'uploadProfilePhoto: storage is not connected. Doing nothing.'
      )
    }
  }

  render() {
    const iconStyle = {
      position: 'relative',
      top: '-2px',
      marginLeft: '3px',
      verticalAlign: 'middle',
      fill: '#FFF'
    }

    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel=""
        onRequestClose={this.props.handleClose}
        shouldCloseOnOverlayClick
        style={{ overlay: { zIndex: 10 } }}
        className="container-fluid text-center"
      >
        <button className="btn btn-primary btn-block" onClick={this.onChangePhotoClick}>
          Upload a Photo <CloudUploadIcon style={iconStyle} />
        </button>
        <button className="btn btn-secondary btn-block">
          Take a photo <CameraIcon style={iconStyle} />
        </button>
        <button
          style={{ marginBottom: -20 }}
          className="btn btn-link btn-xs m-t-20"
          onClick={this.props.handleClose}
        >
          Cancel
        </button>

        <input
          type="file"
          ref={ref => {
            this.photoUpload = ref
          }}
          onChange={this.uploadProfilePhoto}
          style={{ display: 'none' }}
        />
      </Modal>
    )
  }
}

PhotoModal.propTypes = {
  // Own props
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func.isRequired,
  // State props
  localIdentities: PropTypes.array.isRequired,
  defaultIdentity: PropTypes.number.isRequired,
  identityKeypairs: PropTypes.array.isRequired,
  identityAddresses: PropTypes.array.isRequired,
  storageConnected: PropTypes.bool.isRequired,
  api: PropTypes.object.isRequired,
  // Action props
  refreshIdentities: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  localIdentities: state.profiles.identity.localIdentities,
  defaultIdentity: state.profiles.identity.default,
  identityKeypairs: state.account.identityAccount.keypairs,
  identityAddresses: state.account.identityAccount.addresses,
  storageConnected: state.settings.api.storageConnected,
  api: state.settings.api
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ ...IdentityActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PhotoModal)
