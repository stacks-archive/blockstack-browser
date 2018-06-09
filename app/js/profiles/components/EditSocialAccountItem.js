import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import InputGroup from '@components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'

import { getWebAccountTypes } from '@utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditSocialAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    ownerAddress: PropTypes.string.isRequired,
    proofUrl: PropTypes.string,
    verified: PropTypes.bool,
    api: PropTypes.object.isRequired,
    placeholder: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onProofUrlChange: PropTypes.func,
    onVerifyButtonClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
      identifier: props.identifier,
      proofUrl: props.proofUrl
    }

    this.getAccountUrl = this.getAccountUrl.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.collapse = this.collapse.bind(this)
    this.onIdentifierChange = this.onIdentifierChange.bind(this)
    this.onIdentifierBlur = this.onIdentifierBlur.bind(this)
    this.onProofUrlChange = this.onProofUrlChange.bind(this)
    this.shouldShowVerificationInstructions = this.shouldShowVerificationInstructions.bind(this)

    this.debouncedOnChange = debounce(() => {
      this.props.onChange(this.props.service, this.state.identifier)
    }, 1500)

    this.debouncedOnProofUrlChange = debounce(() => {
      this.props.onProofUrlChange(this.props.service, this.state.proofUrl)
    }, 1000)
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        const urlTemplate = webAccountTypes[this.props.service].urlTemplate
        if (urlTemplate) {
          accountUrl = urlTemplate.replace('{identifier}', this.props.identifier)
        }
      }
    }
    return accountUrl
  }

  getIconClass() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier() {
    let identifier = this.state.identifier
    if (identifier.length >= 40) {
      identifier = `${identifier.slice(0, 40)}...`
    }
    return identifier
  }

  handleClick() {
    this.collapse(!this.state.collapsed)
  }

  collapse(collapsed = true) {
    this.setState({
      collapsed
    })
  }

  onIdentifierChange(event) {
    const identifier = event.target.value
    this.setState({
      identifier
    })

    if (this.props.onChange) {
      this.debouncedOnChange()
    }
  }

  onIdentifierBlur(event) {
    this.props.onBlur(event, this.props.service)
    const identifier = event.target.value
    if (identifier.length === 0) {
      this.collapse()
    }
  }

  onProofUrlChange(event) {
    const proofUrl = event.target.value
    this.setState({
      proofUrl
    })

    if (this.props.onProofUrlChange) {
      this.debouncedOnProofUrlChange()
    }
  }

  getPlaceholderText(service) {
    if(service === 'bitcoin' || service === 'ethereum') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> address
        </span>
      )
    }
    else if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your {service.toUpperCase()} key
        </span>
      )
    }
    else {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your <span className="text-capitalize">{service}</span> account
        </span>
      )
    }
  }

  shouldShowVerificationInstructions() {
    return !this.props.verified && (this.props.identifier.length > 0)
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const placeholderClass = this.props.placeholder ? 'placeholder' : ''
    const pending = this.state.collapsed ? 'pending' : ''
    const verifiedClass = this.props.verified ? 'verified' : pending
    const collapsedClass = this.state.collapsed ? 'collapsed' : 'active'
    const webAccountType = webAccountTypes[this.props.service]
    const stopClick = true
    const accountServiceName = webAccountType.label
    const services = ['instagram', 'github', 'twitter', 'facebook', 'linkedIn', 'hackerNews']
    const proofURLInput = () =>
        (<InputGroup
          name="proofUrl"
          label="Proof URL"
          data={this.state}
          placeholder="Paste Proof URL here"
          stopClickPropagation={stopClick}
          onChange={this.onProofUrlChange}
          onBlur={event => this.props.onBlur(event, this.props.service)}
          accessoryIcon={this.props.verified}
          accessoryIconClass="fa fa-check fa-fw fa-lg input-accessory-icon-right"
          disabled={false}
        />)

    if (!webAccountType || this.props.listItem !== true) {
      return <span></span>
    }
    return (
      <div
        className={`account ${placeholderClass} ${verifiedClass} ${collapsedClass}`}
        onClick={this.handleClick}
      >
        <span className="">
          <i className={`fa fa-fw ${this.getIconClass()}`} />
        </span>
          {!this.props.placeholder && (
            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>
          )}

          {!this.props.placeholder && (
            <span className="app-account-service font-weight-normal">
              {`@${accountServiceName}`}
            </span>
          )}

          {this.props.placeholder && (
            <span className="app-account-service font-weight-normal">
              {this.getPlaceholderText(this.props.service)}
            </span>
          )}

        <span className="float-right">
          {!this.props.verified && <span>+1<i className="fa fa-w fa-star-o" /></span>}

          {this.state.collapsed ? <i className="fa fa-w fa-chevron-down" /> :
            <i className="fa fa-w fa-chevron-up" />
          }
        </span>

        <div onClick={e => e.stopPropagation()}>
          <ReactCSSTransitionGroup
            transitionName="account"
            transitionEnterTimeout={400}
            transitionLeaveTimeout={200}
          >

            {!this.state.collapsed &&
              (
              <InputGroup
                key="input-group-identifier"
                name="identifier"
                label="Username"
                data={this.state}
                stopClickPropagation={stopClick}
                onChange={this.onIdentifierChange}
                onBlur={this.onIdentifierBlur}
              />
              )
            }

            {((this.props.verified || this.shouldShowVerificationInstructions()) &&
              !this.state.collapsed && services.indexOf(this.props.service) !== -1) &&
              <div key="input-group-proof">
                {proofURLInput()}
              </div>
            }

            {(this.shouldShowVerificationInstructions() && !this.state.collapsed) &&
              (
              <div>
                <VerificationInfo
                  service={this.props.service}
                  ownerAddress={this.props.ownerAddress}
                  domainName={this.getIdentifier()}
                  onVerifyButtonClick={(e) =>
                    this.props.onVerifyButtonClick(e, this.props.service, this.props.identifier)}
                />
              </div>
              )
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, null)(EditSocialAccountItem)
