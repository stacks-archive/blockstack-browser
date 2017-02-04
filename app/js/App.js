import './utils/proxy-fetch'
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import { AccountActions } from './store/account'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(AccountActions, dispatch)
}

class MainScreen extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  }

  render() {
    return (
      <div className="body-main">
        {this.props.children}
      </div>
    )
  }
}

class ProfilesApp extends Component {
  render() {
    return (
      <div className="body-profiles">
        {this.props.children}
      </div>
    )
  }
}

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    accountCreated: PropTypes.bool.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentHasNewProps(accountCreated) {
    if (!accountCreated) {
      this.context.router.push('/')
    } else {
      this.context.router.push('/identity')
    }
  }

  componentWillMount() {
    this.componentHasNewProps(this.props.accountCreated)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.accountCreated !== this.props.accountCreated) {
      this.componentHasNewProps(nextProps.accountCreated)
    }
  }

  render() {
    if (this.props.accountCreated) {
      return (<MainScreen children={this.props.children} />)
    } else {
      return (<ProfilesApp children={this.props.children} />)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)

/*
{
  (() => {
    if (process.env.NODE_ENV !== 'production') {
      //const DevTools = require('./components/DevTools')
      //return <DevTools />
    }
  })()
}
*/
