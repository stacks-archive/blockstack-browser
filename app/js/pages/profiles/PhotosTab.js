import React, { Component, PropTypes } from 'react'

import { InputGroup, SaveButton } from '../../components/index'

var Dropbox = require('dropbox');

var Dropzone = require('react-dropzone');

class PhotosTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired,
    uploadProfilePhoto: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: null,
      files: []
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
      image: [
        ...profile.image.slice(0, itemIndex),
        ...profile.image.slice(itemIndex + 1)
      ]
    })
    this.setState({profile: newProfile})
    this.props.saveProfile(newProfile)
  }

  createItem(imageType) {
    let profile = this.state.profile
    if (!profile.hasOwnProperty('image')) {
      profile.image = []
    }
    profile.image.push({
      '@type': 'ImageObject',
      'name': imageType,
      'contentUrl': ''
    })
    this.setState({profile: profile})
    this.props.saveProfile(profile)
  }

  onChange(event, itemIndex) {
    let profile = this.state.profile
    profile.image[itemIndex][event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  onDrop(acceptedFiles, rejectedFiles, index) {
    let files = this.state.files
    let profile = this.state.profile

    files[index] = acceptedFiles[0] // only accept 1 file
    files[index].uploaded = false

    this.setState({
      files: files
    })

    this.props.uploadProfilePhoto(files[index], index)
    .then((avatarUrl) => {
      profile.image[index].contentUrl = avatarUrl
      files[index].uploaded = true
      this.setState({
        files: files,
        profile: profile
      })
    })
    .catch((error) => {
      console.error(error)
    })


  }

  onOpenClick() {
      this.refs.dropzone.open();
  }


  render() {
    const profile = this.state.profile,
          images = this.state.profile.hasOwnProperty('image') ?
            this.state.profile.image : [],
          files = this.state.hasOwnProperty('files') ? this.state.files : []
    return (
      <div>
        <div className="form-group">
          <button className="btn btn-primary"
            onClick={() => {this.createItem("avatar")}}>
            Add Profile Photo
          </button>
        </div>
        { images.map((image, index) => {
          return (
            <div key={index} className="card">
              <div className="card-block">
                { image.name === 'avatar' ?
                   <div>

                      <div className="id-flex">
                        <Dropzone
                        onDrop={(acceptedFiles, rejectedFiles) => { this.onDrop(acceptedFiles, rejectedFiles, index) } }
                        multiple={false} maxSize={5242880} accept="image/*"
                        className="dropzone" activeClassName="dropzone-active">
                        { !files[index] && !image.contentUrl ?
                          <div>Drop your photo here or click/tap to select a file!</div>
                        :
                          <div>
                          { image.contentUrl ?
                            <img src={image.contentUrl} className="img-idcard"/>
                            :
                            <img src={files[index].preview} className="img-idcard"/>
                          }
                          <div className="overlay"></div>
                          </div>
                        }
                        </Dropzone>
                      </div>

                    <InputGroup
                      name="contentUrl" label="Profile Image URL"
                      data={profile.image[index]}
                      onChange={(event) => {this.onChange(event, index)}} />
                    </div>
                : null }
                <div className="form-group">
                  <button className="btn btn-outline-primary"
                    onClick={() => {this.deleteItem(index)}}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        }) }
      </div>
    )
  }
}

export default PhotosTab
