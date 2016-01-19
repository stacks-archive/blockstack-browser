import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic
  }
}

class MainScreen extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="content-section">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>          
      </div>
    )
  }
}

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="container">
        <LandingPage />
      </div>
    )
  }
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedMnemonic: PropTypes.string
  }

  render() {
    return (
      <div>
      { this.props.encryptedMnemonic ?
        <MainScreen children={this.props.children} />
      :
        <WelcomeScreen />
      }
      {
        (() => {
          if (false) {
          //if (process.env.NODE_ENV !== 'production') {
            const DevTools = require('./components/DevTools')
            return <DevTools />
          }
        })()
      }
      </div>
    )
  }
}


export default connect(mapStateToProps)(App)
