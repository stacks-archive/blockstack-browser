import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Person, flattenObject } from 'blockchain-profile'

class SaveButton extends Component {
  constructor() {
    super()
    this.state = {
      profileJustSaved: false
    }
  }

  triggerSave() {
    this.props.onSave()
    this.setState({profileJustSaved: true})

    var _this = this
    setTimeout(function() {
      _this.setState({profileJustSaved: false})
    }, 500)
  }

  render() {
    return (
      <div>
      { this.state.profileJustSaved ?
        <button className="btn btn-success" disabled>
            Saving...
        </button>
      :
        <button className="btn btn-primary" onClick={this.triggerSave}>
            Save
        </button>
      }
      </div>
    )
  }
}

class InputGroup extends Component {
  render() {
    var value = this.props.data[this.props.name]
    return (
      <div className="form-group">
        <label className="sr-only">{this.props.label}</label>
        <input name={this.props.name}
          className="form-control input-lg"
          placeholder={
              this.props.placeholder ?
              this.props.placeholder :
              this.props.label
          }
          value={value}
          onChange={this.props.onChange} />
      </div>
    )
  }
}

class Editor extends Component {
  constructor() {
    super()
    this.state = {
      flatProfile: {},
      profileJustSaved: false,
      verifications: []
    }
  }

  componentDidMount() {
  }

  saveProfile() {
  }

  onValueChange(event) {
    var flatProfile = this.state.flatProfile
    flatProfile[event.target.name] = event.target.value
    this.setState({flatProfile: flatProfile})
  }

  render() {
    var flatProfile = this.state.flatProfile
    return (
      <div className="container container-337">
          { flatProfile ? (
          <div>
              <h1>Edit Profile</h1>

              <hr />
              <h3>Basic Information</h3>
              <InputGroup name="givenName" label="First Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="familyName" label="Last Name"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="description" label="Short Bio"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="image[0].contentUrl" label="Profile Image URL"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="website[0].url" label="Website"
                  data={flatProfile} onChange={this.onValueChange} />
              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>

              <hr />
              <h3>Accounts</h3>
              <InputGroup name="account[0].identifier" label="Twitter Username"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="account[0].proofUrl" label="Twitter Proof URL"
                  data={flatProfile} onChange={this.onValueChange} />                
              <InputGroup name="account[1].identifier" label="Facebook Username"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="account[1].proofUrl" label="Facebook Proof URL"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="account[2].identifier" label="GitHub Username"
                  data={flatProfile} onChange={this.onValueChange} />
              <InputGroup name="account[2].proofUrl" label="GitHub Proof URL"
                  data={flatProfile} onChange={this.onValueChange} />
              <div className="form-group">
                  <SaveButton onSave={this.saveProfile} />
              </div>
          </div>
          ) : null }
      </div>
    );
  }
}

export default Editor
