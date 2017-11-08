import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import ReactTooltip from 'react-tooltip'
import { PGPActions } from '../store/pgp'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    pgpPublicKeys: state.profiles.pgp.publicKeys
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PGPActions, dispatch)
}

class PGPAccountItem extends Component {
  static propTypes = {
    editing: PropTypes.bool.isRequired,
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    contentUrl: PropTypes.string,
    loadPGPPublicKey: PropTypes.func.isRequired,
    pgpPublicKeys: PropTypes.object,
    onClick: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false
    }

    this.loadPublicKey = this.loadPublicKey.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
  }

  componentWillMount() {
    this.loadPublicKey()
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    })
  }

  loadPublicKey() {
    if (this.props.contentUrl) {
      const contentUrl = this.props.contentUrl
      this.props.loadPGPPublicKey(contentUrl, this.props.identifier)
    }
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

  getPlaceholderText(service) {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const webAccountType = webAccountTypes[this.props.service]
    let accountServiceName = webAccountType.label
    if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your {service.toUpperCase()} key
        </span>
      )
    }
  }

  onClick = (e) => {
    this.props.onClick(this.props.service)
  }

  render() {
    const identifier = this.props.identifier
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const pgpPublicKeys = this.props.pgpPublicKeys
    const verified = this.props.verified
    const verifiedClass = verified ? "verified" : "pending"
    const placeholderClass = this.props.placeholder ? "placeholder" : ""
    const identifierType = (this.props.service === 'pgp' || this.props.service === 'ssh') ? 'Key' : 'Address'

    let loading = false
    let error = false
    let key = null


    if(pgpPublicKeys && pgpPublicKeys.hasOwnProperty(identifier)) {
      const publicKey = pgpPublicKeys[identifier]
      if(publicKey.loading)
        loading = true
      if(publicKey.error)
        error = publicKey.error
      if(publicKey.key)
        key = publicKey.key
    }

    if (this.props.listItem === true) {
      return (
        <li className={`clickable ${verifiedClass} ${placeholderClass}`} onClick={this.onClick}>
          <Modal
            isOpen={this.state.modalIsOpen}
            contentLabel="PGP Key"
            shouldCloseOnOverlayClick={true}
            style={{overlay: {zIndex: 10}}}
            className="container-fluid react-modal-pgp">
            <button onClick={this.closeModal}>close</button>
            <h2>PGP Key</h2>
            <p>Fingerprint: {identifier}</p>
            <div> { loading
              ?
              <textarea className="form-control" readOnly="true" rows="10"
                value="Loading...">
              </textarea>
              :
              <div>
              { error ?
                <textarea className="form-control" readOnly="true" rows="10"
                  value={error}>
                </textarea>
                :
            <textarea className="form-control" readOnly="true" rows="10"
              value={key}>
            </textarea>
            }
              </div>
            }
            </div>
          </Modal>
          <ReactTooltip place="top" type="dark" effect="solid" id={`verified-${this.props.service}`} className="text-center">
            {this.props.verified ? 'Verified' : 'Pending...'}
          </ReactTooltip>
          {/*<a href="#" onClick={this.openModal} data-toggle="tooltip"*/}

          <span className="">
            <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
          </span>

          {!this.props.placeholder && (
            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>
          )}

          {(!this.props.placeholder && this.props.editing) && (
            <span className="">
              <i className="fa fa-fw fa-pencil" />
            </span>
          )}

          { !this.props.placeholder && (
            <span className="app-account-service font-weight-normal">
              {webAccountTypes[this.props.service].label}
            </span>
          )}

          { this.props.placeholder && (
            <span className="app-account-service font-weight-normal">
              Add your {webAccountTypes[this.props.service].label} {identifierType.toLowerCase()}
            </span> 
          )}

          {/*this.props.verified ?
            <span className="float-right" data-tip data-for={`verified-${this.props.service}`}>
              <i className="fa fa-fw fa-check-circle fa-lg" />
            </span>
            : 
            <span className="float-right" data-tip data-for={`verified-${this.props.service}`}>
              <i className="fa fa-fw fa-clock-o fa-lg" />
            </span>
          */}
        </li>
      )
    } else {
      return (
        <span>
          <i className={`fa ${this.getIconClass()}`} />
          <span>{this.getIdentifier()}</span>
        </span>
      )
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PGPAccountItem)
