import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import InputGroup from '@components/InputGroup'
import VerificationInfo from '../components/VerificationInfo'
import { openInNewTab, getWebAccountTypes, getIconClass, getIdentifier, getIdentifierType } from '@utils'

const helpPages = {
  twitter: 'https://forum.blockstack.org/t/twitter-verification-process/2143',
  facebook: 'https://forum.blockstack.org/t/facebook-verification-process/2142',
  github: 'https://forum.blockstack.org/t/github-verification-process/2145',
  instagram: 'https://forum.blockstack.org/t/instagram-verification-process/2144'
}

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class EditSocialAccount extends Component {
  static propTypes = {
    service: PropTypes.string,
    identifier: PropTypes.string,
    ownerAddress: PropTypes.string,
    api: PropTypes.object.isRequired,
    onPostVerificationButtonClick: PropTypes.func,
    onVerifyButtonClick: PropTypes.func,
    proofUrl: PropTypes.string.isRequired,
    verified: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      identifier: props.identifier,
      proofUrl: props.proofUrl
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      identifier: nextProps.identifier,
      proofUrl: nextProps.proofUrl
    })
  }

  getAccountUrl = () => {
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

  onIdentifierChange = (event) => {
    let identifier = event.target.value

    if (this.props.service === 'twitter'
      || this.props.service === 'instagram') {
      identifier = this.normalizeIdentifier(identifier)
    }

    this.setState({
      identifier
    })
  }

  onProofUrlChange = (event) => {
    const proofUrl = event.target.value
    this.setState({
      proofUrl
    })
  }

  getPlaceholderText = (service) => (
    <span className="app-account-service font-weight-bold">
      Add your <span className="text-capitalize">{service}</span> {getIdentifierType(service)}
    </span>
  )

  getInputAddOn = (service) => {
    if (service === 'facebook') {
      return 'facebook.com/'
    } else if (service === 'twitter') {
      return '@'
    } else if (service === 'github') {
      return 'github.com/'
    } else if (service === 'instagram') {
      return '@'
    } else if (service === 'linkedIn') {
      return 'linkedin.com/in/'
    } else {
      return ''
    }
  }

  normalizeIdentifier = (identifier) => {
    const regex = /^[@]/
    if (identifier.match(regex)) {
      return identifier.replace('@', '')
    } else {
      return identifier
    }
  }

  shouldShowVerificationInstructions = () => 
    !this.props.verified && (this.props.identifier.length > 0)

  showHelp = () => {
    if (helpPages.hasOwnProperty(this.props.service)) {
      openInNewTab(helpPages[this.props.service])
    }
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const collapsedClass = this.state.collapsed ? 'pending' : ''
    const verifiedClass = this.props.verified ? 'verified' : collapsedClass
    const webAccountType = webAccountTypes[this.props.service]
    const inputAddOn = this.getInputAddOn(this.props.service)
    const stopClick = true

    if (webAccountType) {
      return (
        <div>
          <div 
            className={`profile-account ${verifiedClass}`} 
            onClick={this.handleClick}
          >
            <div className="heading m-b-30">
              <i className={`fa fa-fw fa-lg ${getIconClass(this.props.api, this.props.service)}`} />
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
                placeholder="Username"
                data={this.state}
                stopClickPropagation={stopClick} 
                onChange={this.onIdentifierChange} 
                addOn={inputAddOn}
              />
            
              <VerificationInfo
                service={this.props.service}
                ownerAddress={this.props.ownerAddress}
                domainName={getIdentifier(this.state.identifier)}
                proofUrl={this.state.proofUrl}
                onProofUrlChange={this.onProofUrlChange}
                onPostVerificationButtonClick={(e) => {
                  this.props.onPostVerificationButtonClick(
                    e,
                    this.props.service,
                    this.state.identifier
                  )
                }}
              />
            </div>
          </div>
          <button 
            className="btn btn-verify btn-block m-t-15" 
            onClick={() => this.props.onVerifyButtonClick(this.props.service,
              this.state.identifier, this.state.proofUrl)}
          >
            Verify
          </button>
          <div className="text-center">
            {helpPages.hasOwnProperty(this.props.service) && 
              <button 
                className="btn btn-link btn-link-small p-t-10"
                onClick={this.showHelp}
              >
                Need help?
              </button>
            }
          </div>
        </div>
      )
    } else {
      return (
        <span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, null)(EditSocialAccount)
