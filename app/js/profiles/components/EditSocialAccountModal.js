import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import InputGroup from '../../components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'
import { openInNewTab } from '../../utils'

import { getWebAccountTypes } from '../../utils'

const helpPages = {
  twitter: 'https://forum.blockstack.org/t/twitter-verification-process/2143',
  facebook: 'https://forum.blockstack.org/t/facebook-verification-process/2142',
  github: 'https://forum.blockstack.org/t/github-verification-process/2145',
  instagram: 'https://forum.blockstack.org/t/instagram-verification-process/2144',
}

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
    ownerAddress: PropTypes.string,
    api: PropTypes.object.isRequired,
    onPostVerificationButtonClick: PropTypes.func,
    onVerifyButtonClick: PropTypes.func
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

    if (this.props.service === 'twitter') {
      identifier = this.normalizeTwitterIdentifier(identifier)
    }

    this.setState({
      identifier: identifier
    })
  }

  onProofUrlChange = (event) => {
    let proofUrl = event.target.value
    this.setState({
      proofUrl: proofUrl
    })
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

  normalizeTwitterIdentifier = (identifier) => {
    var regex = /^[@]/;
    if (identifier.match(regex)) {
      return identifier.replace('@', '')
    } else {
      return identifier
    }
  }

  shouldShowVerificationInstructions = () => {
    return !this.props.verified && (this.props.identifier.length > 0)
  }

  showHelp = () => {
    if (helpPages.hasOwnProperty(this.props.service)) {
      openInNewTab(helpPages[this.props.service])
    }
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const verifiedClass = this.props.verified ? "verified" : (this.state.collapsed ? "pending" : "")
    let webAccountType = webAccountTypes[this.props.service]
    const disabled = this.props.service === 'hackerNews'

    // const proofURLInput = () => {
    //   if (this.props.service === 'instagram' || this.props.service === 'github'
    //       || this.props.service === 'twitter' || this.props.service === 'facebook'
    //       || this.props.service === 'linkedIn' || this.props.service === 'hackerNews') {
    //     return <InputGroup 
    //               name="proofUrl" 
    //               label="Proof URL" 
    //               data={this.state}
    //               placeholder="Paste Proof URL here"
    //               stopClickPropagation={true} 
    //               onChange={this.onProofUrlChange} 
    //               onBlur={event => this.props.onBlur(event, this.props.service)}
    //               accessoryIcon={this.props.verified}
    //               accessoryIconClass="fa fa-check fa-fw fa-lg input-accessory-icon-right" 
    //               disabled={false}
    //             />
    //   } else {
    //     return <div></div>
    //   }
    // }

    if (webAccountType) {
      let accountServiceName = webAccountType.label
        return (
          <Modal
            isOpen={this.props.isOpen}
            contentLabel=""
            onRequestClose={this.props.onRequestClose}
            shouldCloseOnOverlayClick={true}
            style={{ overlay: { zIndex: 10 } }}
            className="container-fluid social-account-modal"
          >
            <div className={`profile-account ${verifiedClass}`} 
              onClick={this.handleClick}>
              <div className="heading m-b-30">
                <i className={`fa fa-fw fa-lg ${this.getIconClass()}`} />
                {this.getPlaceholderText(this.props.service)}
              </div>

              <div>
                <p>
                  <span className="font-weight-bold">Step 1: </span> 
                  Enter your <span className="text-capitalize">{this.props.service}</span> username.
                </p>

                <InputGroup 
                  key="input-group-identifier"
                  name="identifier" 
                  label="Username" 
                  data={this.state}
                  stopClickPropagation={true} 
                  onChange={this.onIdentifierChange} 
                />
              
                <VerificationInfo
                  service={this.props.service}
                  ownerAddress={this.props.ownerAddress}
                  domainName={this.getIdentifier()}
                  proofUrl={this.state.proofUrl}
                  onProofUrlChange={this.onProofUrlChange}
                  onPostVerificationButtonClick={(e) => {
                    this.props.onPostVerificationButtonClick(e, this.props.service, this.state.identifier)} 
                  }
                  />
              </div>
            </div>
            <button 
              className="btn btn-verify btn-block m-t-15" 
              onClick={e => this.props.onVerifyButtonClick(this.props.service, 
                this.state.identifier, this.state.proofUrl)}>
              Verify
            </button>
            <div className="text-center">
              {helpPages.hasOwnProperty(this.props.service) && 
                <button className="btn btn-link btn-link-small p-t-10" onClick={this.showHelp}>Need help?</button>
              }
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
