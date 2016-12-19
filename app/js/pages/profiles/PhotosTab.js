import React, { Component, PropTypes } from 'react'

import { InputGroup, SaveButton } from '../../components/index'

var Dropzone = require('react-dropzone');

class PhotosTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired
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
    console.log("index: " + index)
    console.log(acceptedFiles)


    files[index] = acceptedFiles[0] // only accept 1 file

      this.setState({
        files: files
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
                   { image.contentUrl === '' ?
                      <Dropzone
                      onDrop={(acceptedFiles, rejectedFiles) => { this.onDrop(acceptedFiles, rejectedFiles, index) } }
                      multiple={false} maxSize={5242880} accept="image/*" >
                      { files[index] ?
                      <div>
                      <img src={files[index].preview}/>
                      </div>
                      : <div>Drop your photo here or click/tap to select a file!</div> }
                      </Dropzone>
                    : null }

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
