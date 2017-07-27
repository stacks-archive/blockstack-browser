import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import StatusBar from './components/StatusBar'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class HomeScreenPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <div className="home-screen-wrap">
      <StatusBar hideBackToHomeLink={true} />
      <div className="home-screen">
        <div className="container-fluid app-center">
          <div className="container app-wrap">
            <div className="app-container no-padding">
              <div className="app-box-wrap">
                <a href="https://helloblockstack.com"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-hello-blockstack@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Hello, Blockstack</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="https://forum.blockstack.org"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-forum@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Forum</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="http://blockstack-todos.appartisan.com/"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-todo-list@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>To Do List</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="http://guild2.herokuapp.com/"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-guild@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Guild</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="http://ongakuryoho.com"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-ongaku-ryoho@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Ongaku Ryoho</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="https://casa.cash"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-casa@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Casa</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="https://www.openbazaar.org"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-openbazaar@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>OpenBazaar</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="https://ntzwrk.org/projects/beacon/"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-beacon@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Beacon</h3>
                </div>
              </div>
              <div className="app-box-wrap">
                <a href="http://www.afiabeta.com/"
                   className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-icon-afia@2x.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Beacon</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenPage)
