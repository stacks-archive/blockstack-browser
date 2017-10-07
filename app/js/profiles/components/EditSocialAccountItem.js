import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import InputGroup from '../../components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'

import { getWebAccountTypes } from '../../utils'

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
  }

  getAccountUrl() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let accountUrl = `http://${this.props.service}.com/${this.props.identifier}`
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      if (webAccountTypes[this.props.service].hasOwnProperty('urlTemplate')) {
        let urlTemplate = webAccountTypes[this.props.service].urlTemplate
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
    let identifier = this.props.identifier
    if (identifier.length >= 40) {
      identifier = identifier.slice(0, 40) + '...'
    }
    return identifier
  }

  handleClick() {
    this.collapse(!this.state.collapsed)
  }

  collapse(collapsed = true) {
    this.setState({
      collapsed: collapsed
    })
  }

  onIdentifierChange(event) {
    if (this.props.onChange) {
      this.props.onChange(this.props.service, event)
    }
  }

  onIdentifierBlur(event) {
    this.props.onBlur(event, this.props.service)
    let identifier = event.target.value
    if (identifier.length == 0) {
      this.collapse()
    }
  }

  onProofUrlChange(event) {
    if (this.props.onProofUrlChange) {
      this.props.onProofUrlChange(this.props.service, event)
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
    const placeholderClass = this.props.placeholder ? "placeholder" : ""
    const verifiedClass = this.props.verified ? "verified" : (this.state.collapsed ? "pending" : "")
    const collapsedClass = this.state.collapsed ? "collapsed" : "active"
    let webAccountType = webAccountTypes[this.props.service]

    const proofURLInput = () => {
      if (this.props.service === 'instagram' || this.props.service === 'github'
          || this.props.service === 'twitter' || this.props.service === 'facebook'
          || this.props.service === 'linkedIn' || this.props.service === 'hackerNews') {
        return <InputGroup 
                  name="proofUrl" 
                  label="Proof URL" 
                  data={this.props}
                  placeholder="Paste Proof URL here"
                  stopClickPropagation={true} 
                  onChange={this.onProofUrlChange} 
                  onBlur={event => this.props.onBlur(event, this.props.service)}
                  accessoryIcon={this.props.verified}
                  accessoryIconClass="fa fa-check fa-fw fa-lg input-accessory-icon-right" />
      } else {
        return <div></div>
      }
    }

    if (webAccountType) {
      let accountServiceName = webAccountType.label
      if (this.props.listItem === true) {
        return (
          <div className={`account ${placeholderClass} ${verifiedClass} ${collapsedClass}`} 
            onClick={this.handleClick}>
            <span className="">
              <i className={`fa fa-fw ${this.getIconClass()}`} />
            </span>
            { !this.props.placeholder && (
                <span className="app-account-identifier">
                  {this.getIdentifier()}
                </span>
              )}

            { !this.props.placeholder && (
                <span className="app-account-service font-weight-normal">
                  {`@${accountServiceName}`}
                </span>
              )}

            { this.props.placeholder && (
                <span className="app-account-service font-weight-normal">
                  { this.getPlaceholderText(this.props.service) }
                </span>
              )}

            <span className="float-right">
              { this.state.collapsed ? <i className="fa fa-w fa-chevron-down" /> : 
                <i className="fa fa-w fa-chevron-up" />
              }
            </span>

            <div onClick={e => e.stopPropagation()}>
              <ReactCSSTransitionGroup
                transitionName="account"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={200}>

                {!this.state.collapsed && 
                  (
                    <InputGroup 
                      key="input-group-identifier"
                      name="identifier" 
                      label="Username" 
                      data={this.props}
                      stopClickPropagation={true} 
                      onChange={this.onIdentifierChange} 
                      onBlur={this.onIdentifierBlur} />
                  )
                }

                {((this.props.verified || this.shouldShowVerificationInstructions()) && !this.state.collapsed) && 
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
      } else {
        return (
          <div></div>
        )
      }
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditSocialAccountItem)
