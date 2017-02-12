import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Modal from 'react-modal'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class DashboardPage extends Component {
  static propTypes = {
  }

  constructor(props) {
    super(props)

    this.state = {
      modalIsOpen: false
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal() {
    this.setState({modalIsOpen: false})
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="container profile-wrap-wide">

          <Modal isOpen={this.state.modalIsOpen}
                 onRequestClose={this.closeModal}
                 contentLabel="This is My Modal"
                 shouldCloseOnOverlayClick={false}>
            <h2 ref="subtitle">Hello</h2>
            <div>I am a modal</div>
            <button onClick={this.closeModal} className="btn btn-primary">
              close
            </button>
          </Modal>

          <section>
            <div className="container-fluid no-padding">
              <div className="col-sm-12 app-container no-padding">
                <div className="col-sm-4">
                  <Link to="/profiles"
                        className="app-box-container" target="_blank">
                    <div className="app-box container-fluid">
                      <img src="/images/app-icon-profiles@2x.png" />
                    </div>
                  </Link>
                  <div className="app-text-container">
                    <h3>Profiles</h3>
                  </div>
                </div>
                <div className="col-sm-4">
                  <Link to="/account/settings"
                        className="app-box-container" target="_blank">
                    <div className="app-box">
                      <img src="/images/app-settings.png" />
                    </div>
                  </Link>
                  <div className="app-text-container">
                    <h3>Settings</h3>
                  </div>
                </div>
                <div className="col-sm-4">
                  <a href="https://helloblockstack.com"
                     className="app-box-container" target="_blank">
                    <div className="app-box">
                      <img src="/images/app-hello-blockstack.png" />
                    </div>
                  </a>
                  <div className="app-text-container">
                    <h3>Hello, Blockstack</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)