import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Modal from 'react-modal'
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

class EditPGPAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    contentUrl: PropTypes.string,
    loadPGPPublicKey: PropTypes.func.isRequired,
    pgpPublicKeys: PropTypes.object,
    placeholder: PropTypes.bool
  }

  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
      showVerificationInstructions: false,
      modalIsOpen: false
    }

    this.loadPublicKey = this.loadPublicKey.bind(this)
    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.getIconClass = this.getIconClass.bind(this)
    this.getIdentifier = this.getIdentifier.bind(this)
    this.handleClick = this.handleClick.bind(this)
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

  getPlaceholderText(service) {
    if (service === 'pgp' || service === 'ssh') {
      return (
        <span className="app-account-service font-weight-normal">
          Prove your {service.toUpperCase()} key
        </span>
      )
    }
  }

  getIdentifier() {
    let identifier = this.props.identifier
    if (identifier.length >= 40) {
      identifier = identifier.slice(0, 40) + '...'
    }
    return identifier
  }

  handleClick() {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  render() {
    const identifier = this.props.identifier
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const pgpPublicKeys = this.props.pgpPublicKeys
    let loading = false
    let error = false
    let key = null

    const placeholderClass = this.props.placeholder ? "placeholder" : ""
    const verifiedClass = !this.props.verified ? "verified" : (this.state.collapsed ? "pending" : "") 
    const collapsedClass = this.state.collapsed ? "collapsed" : "active"

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
        <div className={`account ${placeholderClass} ${verifiedClass} ${collapsedClass}`} 
          onClick={this.handleClick} >
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
                  {`${this.props.service.toUpperCase()}`}
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
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPGPAccountItem)
