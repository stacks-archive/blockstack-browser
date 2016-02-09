import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Navbar from './components/Navbar'

function mapStateToProps(state) {
  return {
    encryptedMnemonic: state.keychain.encryptedMnemonic || ''
  }
}

class MainScreen extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div>
        <Navbar />
        {this.props.children}
      </div>
    )
  }
}

class WelcomeScreen extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    encryptedMnemonic: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentHasNewProps(encryptedMnemonic) {
    const accountExists = (encryptedMnemonic.length > 0) ? true : false
    if (!accountExists) {
      this.context.router.push('/account/create')
    } else {
      this.context.router.push('/')
    }
  }

  componentWillMount() {
    this.componentHasNewProps(this.props.encryptedMnemonic)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.encryptedMnemonic !== this.props.encryptedMnemonic) {
      this.componentHasNewProps(nextProps.encryptedMnemonic)
    }
  }

  render() {
    const accountExists = this.props.encryptedMnemonic.length ? true : false
    return (
      <div>
      { accountExists ?
        <MainScreen children={this.props.children} />
      :
        <WelcomeScreen children={this.props.children} />
      }
      {
        (() => {
          if (process.env.NODE_ENV !== 'production') {
            //const DevTools = require('./components/DevTools')
            //return <DevTools />
          }
        })()
      }
      </div>
    )
  }
}


export default connect(mapStateToProps)(App)
