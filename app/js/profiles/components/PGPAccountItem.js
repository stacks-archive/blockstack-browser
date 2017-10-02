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

class PGPAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    contentUrl: PropTypes.string,
    loadPGPPublicKey: PropTypes.func.isRequired,
    pgpPublicKeys: PropTypes.object
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

  render() {
    const identifier = this.props.identifier
    const webAccountTypes = getWebAccountTypes(this.props.api)
    const pgpPublicKeys = this.props.pgpPublicKeys
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
        <li className={!this.props.verified ? "verified" : "pending"}>
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
          <a href="#" onClick={this.openModal} data-toggle="tooltip"
            title={webAccountTypes[this.props.service].label}>
            
            <span className="">
              <i className={`fa fa-fw ${this.getIconClass()} fa-lg`} />
            </span>

            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>

            { !this.props.placeholder && (
                <span className="app-account-service font-weight-normal">
                  {`${this.props.service.toUpperCase()}`}
                </span>
              )}

            {this.props.verified &&
              <span className="float-right">
                <i className="fa fa-fw fa-check-circle fa-lg" />
              </span>
            }
          </a>
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
