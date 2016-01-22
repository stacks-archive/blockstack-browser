import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { History } from 'react-router'
import reactMixin from 'react-mixin'

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
        <div className="container">
          {this.props.children}
        </div>
      </div>
    )
  }
}

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="container">
        {this.props.children}
      </div>
    )
  }
}

@reactMixin.decorate(History)
class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedMnemonic: PropTypes.string
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.encryptedMnemonic !== this.props.encryptedMnemonic) {
      this.history.pushState(null, 'bookmarks')
    }
  }

  render() {
    const accountExists = this.props.encryptedMnemonic

    return (
      <div>
      { accountExists ?
        <MainScreen children={this.props.children} />
      :
        <WelcomeScreen children={this.props.children} />
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
