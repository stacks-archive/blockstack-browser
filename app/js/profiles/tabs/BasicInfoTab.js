import React, { Component, PropTypes } from 'react'

import InputGroup from '../../components/InputGroup'
import SaveButton from '../../components/SaveButton'

class BasicInfoTab extends Component {
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

  onChange(event) {
    let profile = this.state.profile
    profile[event.target.name] = event.target.value
    this.setState({profile: profile})
  }

  render() {
    return (
      <div>
        <InputGroup name="givenName" label="First Name"
            data={this.props.profile}
            onChange={this.onChange} />
        <InputGroup name="familyName" label="Last Name"
            data={this.props.profile}
            onChange={this.onChange} />
        <InputGroup name="description" label="Short Bio"
            data={this.props.profile}
            onChange={this.onChange} />
      </div>
    )
  }
}

export default BasicInfoTab