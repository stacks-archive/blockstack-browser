import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import InputGroup from '../../components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditSocialAccountModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    service: PropTypes.string,
    identifier: PropTypes.string,
    // ownerAddress: PropTypes.string.isRequired,
    // proofUrl: PropTypes.string,
    // verified: PropTypes.bool,
    api: PropTypes.object.isRequired,
    // onVerifyButtonClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      identifier: props.identifier,
      proofUrl: props.proofUrl,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      identifier: nextProps.identifier,
      proofUrl: nextProps.proofUrl,
    })
  }

  getAccountUrl = () => {
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

  getIconClass = () => {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    let iconClass = ''
    if (webAccountTypes.hasOwnProperty(this.props.service)) {
      iconClass = webAccountTypes[this.props.service].iconClass
    }
    return iconClass
  }

  getIdentifier = () => {
    let identifier = this.state.identifier
    if (identifier.length >= 40) {
      identifier = identifier.slice(0, 40) + '...'
    }
    return identifier
  }

  onIdentifierChange = (event) => {
    let identifier = event.target.value
    this.setState({
      identifier: identifier
    })

    if (this.props.onChange) {
      this.debouncedOnChange()
    }
  }

  onIdentifierBlur = (event) => {
    this.props.onBlur(event, this.props.service)
    let identifier = event.target.value
    if (identifier.length == 0) {
      this.collapse()
    }
  }

  onProofUrlChange = (event) => {
    let proofUrl = event.target.value
    this.setState({
      proofUrl: proofUrl
    })

    if (this.props.onProofUrlChange) {
      this.debouncedOnProofUrlChange()
    }
  }

  getPlaceholderText = (service) => {
    if(service === 'bitcoin' || service === 'ethereum') {
      return (
        <span className="app-account-service font-weight-bold">
          Prove your <span className="text-capitalize">{service}</span> address
        </span>
      )
    }
    else if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-bold">
          Prove your {service.toUpperCase()} key
        </span>
      )
    }
    else {
      return (
        <span className="app-account-service font-weight-bold">
          Prove your <span className="text-capitalize">{service}</span> account
        </span>
      )
    }
  }

  shouldShowVerificationInstructions = () => {
    return !this.props.verified && (this.props.identifier.length > 0)
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const verifiedClass = this.props.verified ? "verified" : (this.state.collapsed ? "pending" : "")
    let webAccountType = webAccountTypes[this.props.service]
    const disabled = this.props.service === 'hackerNews'

    const proofURLInput = () => {
      if (this.props.service === 'instagram' || this.props.service === 'github'
          || this.props.service === 'twitter' || this.props.service === 'facebook'
          || this.props.service === 'linkedIn' || this.props.service === 'hackerNews') {
        return <InputGroup 
                  name="proofUrl" 
                  label="Proof URL" 
                  data={this.state}
                  placeholder="Paste Proof URL here"
                  stopClickPropagation={true} 
                  onChange={this.onProofUrlChange} 
                  onBlur={event => this.props.onBlur(event, this.props.service)}
                  accessoryIcon={this.props.verified}
                  accessoryIconClass="fa fa-check fa-fw fa-lg input-accessory-icon-right" 
                  disabled={false}
                />
      } else {
        return <div></div>
      }
    }

    if (webAccountType) {
      let accountServiceName = webAccountType.label
        return (
          <Modal
            isOpen={this.props.isOpen}
            contentLabel=""
            onRequestClose={this.close}
            shouldCloseOnOverlayClick={false}
            style={{ overlay: { zIndex: 10 } }}
            className="container-fluid social-account-modal"
          >
            <div className={`social-account ${verifiedClass}`} 
              onClick={this.handleClick}>
              <div className="heading m-b-30">
                <i className={`fa fa-fw fa-lg ${this.getIconClass()}`} />
                {this.getPlaceholderText(this.props.service)}
              </div>

              <div>
                <InputGroup 
                  key="input-group-identifier"
                  name="identifier" 
                  label="Username" 
                  data={this.state}
                  stopClickPropagation={true} 
                  onChange={this.onIdentifierChange} 
                  onBlur={this.onIdentifierBlur} />

                {/*((this.props.verified || this.shouldShowVerificationInstructions())) && 
                  <div key="input-group-proof">
                    {proofURLInput()}
                  </div>
                */}
              
                <VerificationInfo
                  service={this.props.service}
                  ownerAddress={this.props.ownerAddress}
                  domainName={this.getIdentifier()}
                  onVerifyButtonClick={(e) => 
                    this.props.onVerifyButtonClick(e, this.props.service, this.props.identifier)} 
                  />
              </div>
            </div>
          </Modal>
        )
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditSocialAccountModal)
