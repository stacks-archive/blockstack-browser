import React, { Component, PropTypes } from 'react'

import InputGroup from '../components/InputGroup'
import SaveButton from '../components/SaveButton'

class PersonalInfoTab extends Component {
  static propTypes = {
    profile: PropTypes.object.isRequired,
    saveProfile: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {profile: this.props.profile}
    this.onChange = this.onChange.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
  }

  saveProfile() {
    this.props.saveProfile(this.state.profile)
  }

  onChange(event, profileSection) {
    let profile = this.state.profile
    if (profileSection) {
      profile[profileSection][event.target.name] = event.target.value
    } else {
      profile[event.target.name] = event.target.value
    }
    this.setState({profile: profile})
  }

  render() {
    let profile = this.state.profile
    if (!profile.hasOwnProperty('address')) {
      profile.address = {
        '@type': 'PostalAddress'
      }
    }
    
    return (
      <div>
        <h4>Private Info</h4>
        <InputGroup name="birthDate" label="Birth Date"
          data={profile}
          onChange={this.onChange}
          onBlur={this.saveProfile} />
        <InputGroup name="streetAddress" label="Street Address"
          data={profile.address}
          onChange={(event) => {this.onChange(event, 'address')}}
          onBlur={this.saveProfile} />
        <InputGroup name="addressLocality"
          label="Address Locality (City, State)"
          data={profile.address}
          onChange={(event) => {this.onChange(event, 'address')}}
          onBlur={this.saveProfile} />
        <InputGroup name="postalCode"
          label="Postal Code"
          data={profile.address}
          onChange={(event) => {this.onChange(event, 'address')}}
          onBlur={this.saveProfile} />
        <InputGroup name="addressCountry"
          label="Address Country"
          data={profile.address}
          onChange={(event) => {this.onChange(event, 'address')}}
          onBlur={this.saveProfile} />
      </div>
    )
  }
}

export default PersonalInfoTab