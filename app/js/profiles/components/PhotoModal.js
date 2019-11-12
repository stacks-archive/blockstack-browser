import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import CameraIcon from 'mdi-react/CameraIcon'
import CloudUploadIcon from 'mdi-react/CloudUploadIcon'
import CheckIcon from 'mdi-react/CheckIcon'
import CloseIcon from 'mdi-react/CloseIcon'
import { Spinner }  from '@ui/components/spinner'
import SimpleButton from '@components/SimpleButton'
import Alert from '@components/Alert'
import { IdentityActions } from '../store/identity'
import log4js from 'log4js'
import { uploadPhoto, resolveGaiaHubConfigForAddress } from '../../account/utils'
import * as Styled from './styled/PhotoModal'

const logger = log4js.getLogger('profiles/components/PhotoModal.js')
const TAKEN_PHOTO_SIZE = 300

const INITIAL_STATE = {
  isUploading: false,
  isTakingPhoto: false,
  isCameraLoading: false,
  photoBlob: null,
  photoError: null
}

class PhotoModal extends React.PureComponent {
  state = { ...INITIAL_STATE }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpen !== nextProps.isOpen) {
      this.setState({ ...INITIAL_STATE })

      if (this.stream && this.stream.getTracks().length) {
        this.stream.getTracks()[0].stop()
      }
    }
  }

  selectPhotoFile = () => {
    this.photoUpload.click()
  }

  startTakingPhoto = () => {
    this.setState({
      isTakingPhoto: true,
      isCameraLoading: true
    }, () => {
      try {
        navigator.mediaDevices.getUserMedia({
          video: true,
          facingMode: 'user'
        })
        .then(stream => {
          this.stream = stream
          this.photoVideo.srcObject = stream
          this.photoVideo.onloadedmetadata = () => {
            this.photoVideo.play()
            this.setState({ isCameraLoading: false })
          }
        })
        .catch(err => {
          logger.error(`onTakePhotoClick: failed to get webcam: ${err.message}`)
          this.setState({
            isCameraLoading: false,
            photoError: 'Unable to get camera access, please enable it and refresh.'
          })
        })
      }
      catch (err) {
        logger.error(`onTakePhotoClick: webcam not supported: ${err.message}`)
        this.setState({
          isCameraLoading: false,
          photoError: 'Your browser doesn’t support camera access'
        })
      }
    })
  }

  takePhoto = () => {
    if (!this.state.isTakingPhoto) {
      logger.warn('takePhoto: called while !isTakingPhoto, doing nothing')
      return
    }

    try {
      const vb = this.photoVideo.getBoundingClientRect()
      const context = this.photoCanvas.getContext('2d')
      context.drawImage(
        this.photoVideo,
        (this.photoCanvas.width - vb.width) / 2,
        (this.photoCanvas.height - vb.height) / 2,
        vb.width,
        vb.height
      )

      const mimeType = 'image/png'
      this.photoCanvas.toBlob(photoBlob => {
        this.setState({ photoBlob })
      }, mimeType)
    } catch(err) {
      logger.error(`takePhoto: failed to take photo: ${err.message}`)
    }
  }

  clearTakenPhoto = () => {
    this.setState({ photoBlob: null })
  }

  uploadTakenPhoto = () => {
    this.uploadPhoto(this.state.photoBlob)
  }

  uploadFilePhoto = ev => {
    this.uploadPhoto(ev.target.files[0])
  }

  uploadPhoto = async file => {
    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]
    const identitySigner = this.props.identityKeypairs[identityIndex]
    const photoIndex = 0

    logger.debug('uploadPhoto: trying to upload...')
    this.setState({ isUploading: true })

    let gaiaHubConfig
    try {
      gaiaHubConfig = await resolveGaiaHubConfigForAddress(
        identitySigner.address, 
        identitySigner.key,
        this.props.api.bitcoinAddressLookupUrl,
        this.props.api.nameLookupUrl,
        this.props.localIdentities
      )
    } catch (error) {
      logger.error(`uploadPhoto: resolveGaiaHubConfigForAddress failed with: ${error}`)
      this.setState({
        photoError: `
          Photo failed to upload. There may have been a connection error,
          or your photo may be too large.
        `,
        isUploading: false
      })
      return
    }

    try {
      const avatarUrl = await uploadPhoto(
        gaiaHubConfig,
        identity,
        file,
        photoIndex
      )
      logger.warn(`uploadPhoto: uploaded photo: ${avatarUrl}`)
      this.props.onUpload(avatarUrl)
      this.props.refreshIdentities(
        this.props.api,
        this.props.identityAddresses
      )
      this.setState({ isUploading: false })
    } catch (error) {
      logger.error(`uploadPhoto: upload failed with error: ${error.message}`)
      this.setState({
        photoError: `
          Photo failed to upload. There may have been a connection error,
          or your photo may be too large.
        `,
        isUploading: false
      })
    }
  }

  render() {
    const { isUploading, isTakingPhoto, isCameraLoading, photoBlob, photoError } = this.state
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
        style={{ overlay: { zIndex: 10 } }}
        className="container-fluid text-center"
      >
        {photoError &&
          <div className="m-b-10 text-left">
            <Alert status="danger" message={photoError} />
          </div>
        }

        {isTakingPhoto ? (
          <Styled.PhotoContainer>
            {/* video and canvas elements don’t work with styled components */}
            <video
              ref={(el) => { this.photoVideo = el }}
              style={{
                position: 'absolute',
                top: 0,
                height: '100%',
                left: '50%',
                transform: 'translateX(-50%)'
              }}
            />
            <canvas
              height={TAKEN_PHOTO_SIZE}
              width={TAKEN_PHOTO_SIZE}
              ref={(el) => { this.photoCanvas = el }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: photoBlob ? '1' : '0'
              }}
            />
            {isCameraLoading &&
              <Styled.PhotoLoader>
                <Spinner size={40} />
              </Styled.PhotoLoader>
            }
            {photoBlob && <Styled.CameraFlash />}
            {photoBlob ? (
              <Styled.PhotoActions>
                <Styled.PhotoActionButton
                  onClick={this.uploadTakenPhoto}
                  disabled={isUploading}
                  positive
                >
                  {isUploading ? <Spinner /> : <CheckIcon />}
                </Styled.PhotoActionButton>
                <Styled.PhotoActionButton
                  onClick={this.clearTakenPhoto}
                  disabled={isUploading}
                  negative
                >
                  <CloseIcon />
                </Styled.PhotoActionButton>
              </Styled.PhotoActions>
            ) : (
              <Styled.PhotoActions>
                <button className="btn btn-primary" onClick={this.takePhoto}>
                  Take Photo
                </button>
              </Styled.PhotoActions>
            )}
          </Styled.PhotoContainer>
        ) : (
          <>
            <SimpleButton
              type="primary"
              onClick={this.selectPhotoFile}
              loading={isUploading}
              block
            >
              Upload a Photo {!isUploading && <CloudUploadIcon style={iconStyle} />}
            </SimpleButton>
            <SimpleButton
              type="secondary"
              onClick={this.startTakingPhoto}
              disabled={isUploading}
              block
            >
              Take a photo <CameraIcon style={iconStyle} />
            </SimpleButton>
          </>
        )}

        <SimpleButton
          type="link"
          size="xs"
          style={{ marginBottom: -20, marginTop: 20 }}
          onClick={this.props.handleClose}
        >
          Cancel
        </SimpleButton>

        <input
          type="file"
          ref={ref => {
            this.photoUpload = ref
          }}
          onChange={this.uploadFilePhoto}
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
