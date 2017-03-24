import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Modal from 'react-modal'

import { getWebAccountTypes } from '../../utils'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

class PGPAccountItem extends Component {
  static propTypes = {
    listItem: PropTypes.bool.isRequired,
    service: PropTypes.string.isRequired,
    identifier: PropTypes.string.isRequired,
    contentUrl: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false,
      publicKey: ''
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

  componentWillReceiveProps() {
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
      proxyFetch(contentUrl)
        .then(response => response.text())
        .then(responseText => {
          this.setState({
            publicKey: responseText
          })
        })
        .catch((e) => {
          console.log(e.stack)
        })
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
    if (identifier.length >= 15) {
      identifier = identifier.slice(0, 15) + '...'
    }
    return identifier
  }

  render() {
    const webAccountTypes = getWebAccountTypes(this.props.api)
    if (this.props.listItem === true) {
      return (
        <li>
          <Modal
            isOpen={this.state.modalIsOpen}
            contentLabel="PGP Key"
            shouldCloseOnOverlayClick={true}
            style={{overlay: {zIndex: 10}}}
            className="container-fluid react-modal-pgp">
            <button onClick={this.closeModal}>close</button>
            <h2>PGP Key</h2>
            <p>Fingerprint: {this.props.identifier}</p>
            <textarea className="form-control" readOnly="true" rows="10"
              value={this.state.publicKey}>
            </textarea>
          </Modal>
          <a href="#" onClick={this.openModal} data-toggle="tooltip"
            title={webAccountTypes[this.props.service].label}>
            {this.props.verified ?
            <span className="fa-stack fa-lg">
              <i className="fa fa-certificate fa-stack-2x fa-green" />
              <i className={`fa ${this.getIconClass()} fa-stack-1x`} />
            </span>
            :
            <span className="fa-stack fa-lg">
              <i className={`fa ${this.getIconClass()} fa-stack-1x`} />
            </span>
            }
            <span className="app-account-identifier">
              {this.getIdentifier()}
            </span>
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

export default connect(mapStateToProps, null)(PGPAccountItem)
