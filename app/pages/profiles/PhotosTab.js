import React, { Component, PropTypes } from 'react'

import { InputGroup, SaveButton } from '../../components/index'

class PhotosTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      profile: null
    }
    this.onChange = this.onChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
    this.createNewItem = this.createNewItem.bind(this)
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

  createNewItem() {
    let profile = this.state.profile
    if (!profile.hasOwnProperty('image')) {
      profile.image = []
    }
    profile.image.push({
      '@type': 'ImageObject',
      'name': 'avatar',
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

  render() {
    const profile = this.state.profile,
          images = this.state.profile.hasOwnProperty('image') ?
            this.state.profile.image : []
    return (
      <div>
        <h4>Photos</h4>
        <div className="form-group">
          <button className="btn btn-primary" onClick={this.createNewItem}>
            New Photo
          </button>
        </div>
        { images.map((image, index) => {
          return (
            <div key={index}>
              <InputGroup
                name="contentUrl" label="Image URL"
                data={profile.image[index]}
                onChange={(event) => {this.onChange(event, index)}} />
              <div className="form-group">
                <button className="btn btn-outline-primary"
                  onClick={() => {this.deleteItem(index)}}>
                  Delete
                </button>
              </div>
            </div>
          )
        }) }
      </div>
    )
  }
}

export default PhotosTab