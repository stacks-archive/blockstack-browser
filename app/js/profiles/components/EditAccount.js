import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import InputGroup from '@components/InputGroup'

import { getWebAccountTypes, getIconClass, getIdentifierType } from '@utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditAccount extends Component {
  static propTypes = {
    service: PropTypes.string,
    identifier: PropTypes.string,
    api: PropTypes.object.isRequired,
    onDoneButtonClick: PropTypes.func,
    verified: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      identifier: props.identifier
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      identifier: nextProps.identifier
    })
  }

  onIdentifierChange = (event) => {
    const identifier = event.target.value
    this.setState({
      identifier
    })
  }

  getPlaceholderText = (service) => (
    <span className="app-account-service font-weight-bold">
      Add your <span className="text-capitalize">{service}</span> {getIdentifierType(service)}
    </span>
  )

  capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const unverifiedClass = (this.state.collapsed ? 'pending' : '')
    const verifiedClass = this.props.verified ? 'verified' : unverifiedClass 
    const webAccountType = webAccountTypes[this.props.service]

    if (!webAccountType) {
      return <span></span>
    }
    return (
      <div>
        <div
          className={`profile-account ${verifiedClass}`}
          onClick={this.handleClick}
        >
          <div className='heading m-b-30'>
            <i className={`fa fa-fw fa-lg ${getIconClass(this.props.api, this.props.service)}`} />
            {this.getPlaceholderText(this.props.service)}
          </div>

          <div>
            <InputGroup
              key='input-group-identifier'
              name='identifier'
              placeholder={this.capitalize(getIdentifierType(this.props.service))}
              data={this.state}
              stopClickPropagation
              onChange={this.onIdentifierChange}
            />

          </div>
        </div>
        <button
          className='btn btn-verify btn-block m-t-15'
          onClick={() => this.props.onDoneButtonClick(this.props.service, 
      this.state.identifier)}
        >
          Save
        </button>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(EditAccount)
